import "./TagViewer.css"
import "./GridViewer.css"
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Pagination, Button, Spin, Modal, Descriptions, Input } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { getMoivesByFilter, getTagByName, likeTag } from "../services/DataService";
import MovieViewer from "./MovieViewer";
import { NAME_TAG_CELL_WIDTH, NAME_TAG_CELL_HEIGHT, MIN_GRID_ITEMS_PER_PAGE } from "../Constant";
import { useGridItemsPerPage } from "../hooks/useGridItemsPerPage";
import { useGridPagination } from "../hooks/useGridPagination";

const { Search } = Input;

const TagViewer = forwardRef((props, ref) => {
    const listRef = useRef(null);
    const numEachPage = useGridItemsPerPage(listRef, NAME_TAG_CELL_WIDTH, NAME_TAG_CELL_HEIGHT, MIN_GRID_ITEMS_PER_PAGE);
    const [tags, setTags] = useState([]);
    const { currentPage, minValue, maxValue, handlePageChange } = useGridPagination(tags, numEachPage);
    const [tag, setTag] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [likeFlag, setLikeFlag] = useState(0);

    const movieViewer = useRef();

    useImperativeHandle(ref, () => ({
        initializeTags(tags) {
            init(tags);
        },
        setIsLoading() {
            setIsLoading(true);
        }
    }));

    function init(tags) {
        setTags(tags);
        setIsLoading(false);
    }

    function showTagDetails(tagIndex) {
        getTagByName(tags[tagIndex]).then(resp => {
            setTag(resp[0]);
            setVisible(true);
            movieViewer?.current.setIsLoading();
            setLikeFlag(resp[0].liked);
            getMoivesByFilter(1, [tags[tagIndex]], false).then(resp => {
                movieViewer?.current.initializeMovies(resp, tags[tagIndex]);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    function onSearch(value) {
        setIsLoading(true);
        getTagByName(value).then(resp => {
            let tags = resp ? resp.map(x => x.name) : [];
            init(tags);
        }).catch(error => console.log(error));
    }

    function onLikeClick() {
        setIsLikeLoading(true);
        likeTag(tag?.name).then(resp => {
            setIsLikeLoading(false);
            setLikeFlag(resp);
        }).catch(error => console.log(error));
    }

    return (
        <div className="grid-viewer tag-viewer">
            <div className="grid-viewer-toolbar">
                <Pagination
                    simple
                    current={currentPage}
                    pageSize={numEachPage}
                    onChange={handlePageChange}
                    total={tags?.length}
                    className="header-left"
                    disabled={isLoading}
                />
                <Search placeholder="类型名" onSearch={onSearch} className="header-right tag-search-bar" loading={isLoading} />
            </div>
            <div className="grid-viewer-list tag-list" ref={listRef}>
                {isLoading ? <div className="grid-viewer-loading"><Spin size="large" /></div> :
                    tags?.slice(minValue, maxValue).map((tag, i) =>
                        <Button key={"tag-" + i + minValue} className="tag-button" onClick={() => showTagDetails(i + minValue)}>
                            <span className="tag-span">{tag}</span>
                        </Button>)}
            </div>
            <Modal
                title={[<Button key="tag-like-btn"
                    shape="circle"
                    icon={likeFlag === true ? <HeartFilled /> : <HeartOutlined />}
                    onClick={onLikeClick}
                    loading={isLikeLoading}></Button>]}
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={1100}
                className="tag-details"
            >
                <Descriptions title={tag?.name} bordered>
                </Descriptions>
                <MovieViewer ref={movieViewer} searchString2={tag?.name} searchType="Tag"/>
            </Modal>
        </div>
    )
});
export default TagViewer;
