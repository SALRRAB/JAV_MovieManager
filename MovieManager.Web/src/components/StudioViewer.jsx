import "./StudioViewer.css"
import "./GridViewer.css"
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Pagination, Button, Spin, Modal, Descriptions, Input } from 'antd';
import { getMoivesByFilter } from "../services/DataService";
import MovieViewer from "./MovieViewer";
import { NAME_TAG_CELL_WIDTH, NAME_TAG_CELL_HEIGHT, MIN_GRID_ITEMS_PER_PAGE } from "../Constant";
import { useGridItemsPerPage } from "../hooks/useGridItemsPerPage";
import { useGridPagination } from "../hooks/useGridPagination";

const { Search } = Input;

const studioViewer = forwardRef((props, ref) => {
    const listRef = useRef(null);
    const numEachPage = useGridItemsPerPage(listRef, NAME_TAG_CELL_WIDTH, NAME_TAG_CELL_HEIGHT, MIN_GRID_ITEMS_PER_PAGE);
    const [studios, setStudios] = useState([]);
    const [originalStudios, setOriginalStudios] = useState([]);
    const { currentPage, minValue, maxValue, handlePageChange } = useGridPagination(studios, numEachPage);
    const [studio, setStudio] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    const movieViewer = useRef();

    useImperativeHandle(ref, () => ({
        initializeStudios(studios) {
            init(studios);
        },
        setIsLoading() {
            setIsLoading(true);
        }
    }));

    function init(studios) {
        setStudios(studios);
        if (originalStudios.length === 0) {
            setOriginalStudios(studios);
        }
        setIsLoading(false);
    }

    function showStudioDetails(studioIndex) {
        setStudio(studios[studioIndex]);
        setVisible(true);
        getMoivesByFilter(5, [studios[studioIndex]], false).then(resp => {
            movieViewer?.current.initializeMovies(resp, studios[studioIndex]);
        });
    }

    function onSearch(value) {
        setIsLoading(true);
        if (value && value.trim()) {
            const filteredStudios = originalStudios.filter(studio =>
                studio && studio.toLowerCase().includes(value.toLowerCase())
            );
            init(filteredStudios);
        } else {
            init(originalStudios);
        }
    }

    return (
        <div className="grid-viewer studio-viewer">
            <div className="grid-viewer-toolbar">
                <Pagination
                    simple
                    current={currentPage}
                    pageSize={numEachPage}
                    onChange={handlePageChange}
                    total={studios?.length}
                    className="header-left"
                    disabled={isLoading}
                />
                <Search placeholder="工作室名" onSearch={onSearch} className="header-right studio-search-bar" loading={isLoading} />
            </div>
            <div className="grid-viewer-list studio-list" ref={listRef}>
                {isLoading ? <div className="grid-viewer-loading"><Spin size="large" /></div> :
                    studios?.slice(minValue, maxValue).map((studio, i) =>
                        <Button key={"studio-" + i + minValue} className="studio-button" onClick={() => showStudioDetails(i + minValue)}>
                            <span className="studio-span">{studio || "佚名工作室"}</span>
                        </Button>)}
            </div>
            <Modal
                title={[<Button key="studio-like-btn"
                    shape="circle"></Button>]}
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={1100}
                className="studio-details"
            >
                <Descriptions title={studio} bordered>
                </Descriptions>
                <MovieViewer ref={movieViewer} />
            </Modal>
        </div>
    )
});
export default studioViewer;
