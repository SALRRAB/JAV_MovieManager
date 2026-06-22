import "./DirectorViewer.css"
import "./GridViewer.css"
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Pagination, Button, Spin, Modal, Descriptions, Input } from 'antd';
import { getMoivesByFilter } from "../services/DataService";
import MovieViewer from "./MovieViewer";
import { NAME_TAG_CELL_WIDTH, NAME_TAG_CELL_HEIGHT, MIN_GRID_ITEMS_PER_PAGE } from "../Constant";
import { useGridItemsPerPage } from "../hooks/useGridItemsPerPage";
import { useGridPagination } from "../hooks/useGridPagination";

const { Search } = Input;

const directorViewer = forwardRef((props, ref) => {
    const listRef = useRef(null);
    const numEachPage = useGridItemsPerPage(listRef, NAME_TAG_CELL_WIDTH, NAME_TAG_CELL_HEIGHT, MIN_GRID_ITEMS_PER_PAGE);
    const [directors, setDirectors] = useState([]);
    const [originalDirectors, setOriginalDirectors] = useState([]);
    const { currentPage, minValue, maxValue, handlePageChange } = useGridPagination(directors, numEachPage);
    const [director, setDirector] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    const movieViewer = useRef();

    useImperativeHandle(ref, () => ({
        initializeDirectors(directors) {
            init(directors);
        },
        setIsLoading() {
            setIsLoading(true);
        }
    }));

    function init(directors) {
        setDirectors(directors);
        if (originalDirectors.length === 0) {
            setOriginalDirectors(directors);
        }
        setIsLoading(false);
    }

    function showDirectorDetails(directorIndex) {
        setDirector(directors[directorIndex]);
        setVisible(true);
        getMoivesByFilter(3, [directors[directorIndex]], false).then(resp => {
            movieViewer?.current.initializeMovies(resp, directors[directorIndex]);
        });
    }

    function onSearch(value) {
        setIsLoading(true);
        if (value && value.trim()) {
            const filteredDirectors = originalDirectors.filter(director =>
                director && director.toLowerCase().includes(value.toLowerCase())
            );
            init(filteredDirectors);
        } else {
            init(originalDirectors);
        }
    }

    return (
        <div className="grid-viewer director-viewer">
            <div className="grid-viewer-toolbar">
                <Pagination
                    simple
                    current={currentPage}
                    pageSize={numEachPage}
                    onChange={handlePageChange}
                    total={directors?.length}
                    className="header-left"
                    disabled={isLoading}
                />
                <Search placeholder="导演名" onSearch={onSearch} className="header-right director-search-bar" loading={isLoading} />
            </div>
            <div className="grid-viewer-list director-list" ref={listRef}>
                {isLoading ? <div className="grid-viewer-loading"><Spin size="large" /></div> :
                    directors?.slice(minValue, maxValue).map((director, i) =>
                        <Button key={"director-" + i + minValue} className="director-button" onClick={() => showDirectorDetails(i + minValue)}>
                            <span className="director-span">{director || "佚名导演"}</span>
                        </Button>)}
            </div>
            <Modal
                title={[<Button key="director-like-btn"
                    shape="circle"></Button>]}
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={1100}
                className="director-details"
            >
                <Descriptions title={director} bordered>
                </Descriptions>
                <MovieViewer ref={movieViewer} />
            </Modal>
        </div>
    )
});
export default directorViewer;
