import "./ActorViewer.css"
import "./GridViewer.css"
import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Pagination, Button, Spin, Modal, Descriptions, Input, message, Card } from 'antd';
import { HeartFilled, HeartOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getActorByName, likeActor, getMoivesByFilter, createPotPlayerPlayListByActors, getActorByNames, getImage } from "../services/DataService";
import MovieViewer from "./MovieViewer";
import { ACTOR_CARD_CELL_WIDTH, ACTOR_CARD_CELL_HEIGHT, MIN_GRID_ITEMS_PER_PAGE } from "../Constant";
import { useGridItemsPerPage } from "../hooks/useGridItemsPerPage";
import { useGridPagination } from "../hooks/useGridPagination";

const { Search } = Input;
const { Meta } = Card;

const ActorViewer = forwardRef((props, ref) => {
    const listRef = useRef(null);
    const numEachPage = useGridItemsPerPage(listRef, ACTOR_CARD_CELL_WIDTH, ACTOR_CARD_CELL_HEIGHT, MIN_GRID_ITEMS_PER_PAGE);
    const [actorNames, setActorNames] = useState([]);
    const { currentPage, minValue, maxValue, handlePageChange } = useGridPagination(actorNames, numEachPage);
    const [actor, setActor] = useState(null);
    const [currentPageActorCardDetails, setCurrentPageActorCardDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [likeFlag, setLikeFlag] = useState(0);

    const movieViewer = useRef();
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useImperativeHandle(ref, () => ({
        initializeActors(actorNames) {
            resetViewer();
            init(actorNames);
        },
        setIsLoading() {
            setIsLoading(true);
        }
    }));

    useEffect(() => {
        const fetchActorDetails = async () => {
            if (actorNames.length > 0) {
                setIsLoading(true);
                try {
                    const resp = await getActorByNames(actorNames.slice(minValue, maxValue));
                    setCurrentPageActorCardDetails(resp);
                } catch (error) {
                    console.log(error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setCurrentPageActorCardDetails([]);
                setIsLoading(false);
            }
        };

        fetchActorDetails();
    }, [actorNames, minValue, maxValue]);

    function resetViewer() {
        setActorNames([]);
        setActor(null);
        setCurrentPageActorCardDetails([]);
        setVisible(false);
        setIsLikeLoading(false);
        setLikeFlag(0);
    }

    function init(actorNames) {
        setActorNames(actorNames);
    }

    function showActorDetails(actorIndex) {
        getActorByName(currentPageActorCardDetails[actorIndex].name).then(resp => {
            setActor(resp[0]);
            setVisible(true);
            movieViewer?.current.setIsLoading();
            setLikeFlag(resp[0].liked);
            getMoivesByFilter(0, [resp[0].name], false).then(resp => {
                movieViewer?.current.initializeMovies(resp, currentPageActorCardDetails[actorIndex].name);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    async function onSearch(value) {
        setIsLoading(true);
        try {
            const resp = await getActorByName(value);
            const actors = resp ? resp.map(x => x.name) : [];
            resetViewer();
            await sleep(1000);
            init(actors);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    function onLikeClick() {
        setIsLikeLoading(true);
        likeActor(actor?.name).then(resp => {
            setIsLikeLoading(false);
            setLikeFlag(resp);
        }).catch(error => console.log(error));
    }

    function createPotPlayList() {
        let actorslist = [];
        for (let i = 0; i < actorNames.length; ++i) {
            actorslist.push(actorNames[i]);
        }
        createPotPlayerPlayListByActors(actorslist, "Selected Actors").then(() => {
            message.info("加入完毕");
        }).catch((error) => {
            console.log(error);
            message.info("加入失败!");
        });
    }

    return (
        <div className="grid-viewer actor-viewer">
            <div className="grid-viewer-toolbar">
                <Pagination
                    simple
                    current={currentPage}
                    pageSize={numEachPage}
                    onChange={handlePageChange}
                    total={actorNames?.length}
                    className="header-left"
                    disabled={isLoading}
                />
                <div className="header-right">
                    <Search placeholder="演员名" onSearch={onSearch} className="header-element-right actor-search-bar" loading={isLoading} />
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        disabled={actorNames?.length === 0 || isLoading ? true : false}
                        onClick={createPotPlayList}
                        className="header-element-right">
                        加入PotPlayer列表
                    </Button>
                </div>
            </div>
            <div className="grid-viewer-list actor-list" ref={listRef}>
                {isLoading ? <div className="grid-viewer-loading"><Spin size="large" /></div> :
                    currentPageActorCardDetails?.map((actor, i) =>
                        <Card
                            hoverable
                            key={"actor-" + i + minValue}
                            className="actor-poster-card"
                            onClick={() => showActorDetails(i)}
                            cover={<ImageLoader type={10} id={actor?.name} />}
                        >
                            <Meta title={actor?.name} />
                        </Card>)}
            </div>
            <Modal
                title={[<Button key="actor-like-btn"
                    shape="circle"
                    icon={likeFlag === true ? <HeartFilled /> : <HeartOutlined />}
                    onClick={onLikeClick}
                    loading={isLikeLoading}></Button>]}
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={1600}
                className="actor-details"
            >
                <div className="left-container">
                    <Card
                        hoverable
                        cover={<ImageLoader type={11} id={actor?.name} />}
                        className="actor-detail-card"
                    ></Card>
                </div>
                <div className="right-container">
                    <Descriptions title={actor?.name} bordered>
                        <Descriptions.Item label="姓名" span={2}>{actor?.name}</Descriptions.Item>
                        <Descriptions.Item label="生日">{actor?.dateofBirth}</Descriptions.Item>
                        <Descriptions.Item label="身高" span={2}>{actor?.height}</Descriptions.Item>
                        <Descriptions.Item label="罩杯">{actor?.cup}</Descriptions.Item>
                        <Descriptions.Item label="胸围" span={1}>{actor?.bust ?? "?"} cm</Descriptions.Item>
                        <Descriptions.Item label="腰围" span={1}>{actor?.waist ?? "?"} cm</Descriptions.Item>
                        <Descriptions.Item label="臀围" span={1}>{actor?.hips ?? "?"} cm</Descriptions.Item>
                        <Descriptions.Item label="颜值" span={1}>{actor?.looks ?? "?"} 分</Descriptions.Item>
                        <Descriptions.Item label="身材" span={1}>{actor?.body ?? "?"} 分</Descriptions.Item>
                        <Descriptions.Item label="色情" span={1}>{actor?.sexAppeal ?? "?"} 分</Descriptions.Item>
                        <Descriptions.Item label="总体">{actor?.overall ?? "?"} 分</Descriptions.Item>
                    </Descriptions>
                    <MovieViewer ref={movieViewer} searchString2={actor?.name} searchType="Actor" />
                </div>
            </Modal>
        </div>
    )
});

const ImageLoader = ({ type, id }) => {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const src = await getImage(type, id);
            setImageSrc(src);
        };
        fetchImage();
    }, [type, id]);

    return imageSrc ? <img src={imageSrc} alt="" className="actor-image" /> : <img src={require('../Imgs/NotFound.jpg')} alt="" className="actor-image" />;
};

export default ActorViewer;
