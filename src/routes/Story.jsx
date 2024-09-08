import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiComments } from "react-icons/tfi";
import { IoIosList } from "react-icons/io";
import useFetch from "../components/hooks/useFetch";
import Chapter from "../components/cards/Chapter";
import BtnSidebar from "../components/buttons/BtnSidebar";
import DisplaySettings from "../components/menu/DisplaySettings";
import Loader from "../components/loaders/Loader";

const Story = () => {
    // React Router parameters
    const { storyId, chapterUrl } = useParams();

    // API URLs
    const [storyApiUrl, setStoryApiUrl] = useState(
        `https://us-central1-cb-story-app-27012024.cloudfunctions.net/getStoryDetails?storyId=${storyId}&chapterUrl=${chapterUrl}`
    );
    const [storyIndexApiUrl, setStoryIndexApiUrl] = useState(
        `https://us-central1-cb-story-app-27012024.cloudfunctions.net/getStoryIndex?storyId=${storyId}`
    );

    // States
    const [chapterArr, setChapterArr] = useState([]);
    const [chapterIndexArr, setChapterIndexArr] = useState([]);
    const [prevChapterUrl, setPrevUrl] = useState(null);
    const [nextChapterUrl, setNextUrl] = useState(null);
    const currentChapterRef = useRef(null);
    const [chapterIndexContent, setChapterIndexContent] = useState([]);
    const [settingsContent, setSettingsContent] = useState(() => {
        const savedSettings = localStorage.getItem('storySettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            backgroundColor: '#302F31',
            backgroundColors: ['#ffffff', '#F4EAC7', '#302F31'],
            fontFamily: 'Fira Sans',
            fontFamilies: ['Poppins', 'Fira Sans', 'Merriweather'],
            fontSize: 18,
        };
    });

    // Story Sidebar
    const [storySidebarOpen, setStorySidebarOpen] = useState(false);
    const [storySidebarOptions, setStorySidebarOptions] = useState({
        "chapterIndex": {
            "active": false,
            "content": chapterIndexContent
        },
        "settings": {
            "active": false,
            "content": "Settings Content"
        },
        "comments": {
            "active": false,
            "content": "Comments Content"
        }
    });

    // Loading states for previous and next chapters
    const [prevChapterLoading, setPrevChapterLoading] = useState(false);
    const [nextChapterLoading, setNextChapterLoading] = useState(false);

    // Fetch story data from API
    const {
        data: storyData,
        loading: storyLoading,
        error: storyError,
    } = useFetch(storyApiUrl, {}, {}[(storyId, chapterUrl)]);

    // Fetch story index data from API
    const {
        data: storyIndexData,
        loading: storyIndexLoading,
        error: storyIndexError,
    } = useFetch(storyIndexApiUrl);

    // Effects
    useEffect(() => {
        if (storyData) {
            if (!chapterArr.some(
                (chapter) => JSON.stringify(chapter) === JSON.stringify(storyData.data)
            )) {
                setChapterArr((prev) => [...prev, storyData.data]);
            }
        }
    }, [storyData]);

    useEffect(() => {
        if (storyIndexData) {
            setChapterIndexArr(storyIndexData.data);
            setChapterIndexContent(storyIndexData.data);
        }
    }, [storyIndexData]);

    useEffect(() => {
        const currentChapterUrl = chapterIndexArr.findIndex(
            (chapter) => chapter.ChapterUrl === chapterUrl
        );
        const previousChapterUrl =
            currentChapterUrl > 0
                ? chapterIndexArr[currentChapterUrl - 1].ChapterUrl
                : null;
        const nextChapterUrl =
            currentChapterUrl < chapterIndexArr.length - 1
                ? chapterIndexArr[currentChapterUrl + 1].ChapterUrl
                : null;
        setPrevUrl(previousChapterUrl);
        setNextUrl(nextChapterUrl);
    }, [chapterUrl, chapterIndexArr]);

    // Function to fetch chapter data
    const fetchChapterData = async (storyId, chapterUrl) => {
        const response = await fetch(
            `https://us-central1-cb-story-app-27012024.cloudfunctions.net/getStoryDetails?storyId=${storyId}&chapterUrl=${chapterUrl}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        return responseData.data;
    };

    // Function to scroll to current chapter
    const scrollToCurrentChapter = () => {
        if (currentChapterRef.current) {
            if (currentChapterRef.current === document.querySelector(`#${chapterUrl}`)) {
            } else {
                currentChapterRef.current = document.querySelector(`#${chapterUrl}`);
            }
            currentChapterRef.current.scrollIntoView();
        }
    };

    // Function to handle sidebar click
    const handleSidebarClick = (option) => {
        let allInactive = true;
        const updatedOptions = Object.keys(storySidebarOptions).reduce((acc, key) => {
            if (key === option) {
                acc[key] = { ...storySidebarOptions[key], active: !storySidebarOptions[key]['active'] };
            } else {
                acc[key] = { ...storySidebarOptions[key], active: false };
            }
            if (acc[key]['active']) {
                allInactive = false;
            }
            return acc;
        }, {});

        setStorySidebarOptions(updatedOptions);
        setStorySidebarOpen(!allInactive);
    };

    // Function to handle background color click
    const handleBgColorClick = (color) => {
        setSettingsContent((prevSettings) => ({
            ...prevSettings,
            backgroundColor: color,
        }));
        saveSettingsToLocalStorage({
            ...settingsContent,
            backgroundColor: color
        });
    };

    // Function to handle font family click
    const handleFontFamilyClick = (fontFamily) => {
        setSettingsContent((prevSettings) => ({
            ...prevSettings,
            fontFamily: fontFamily,
        }));
        saveSettingsToLocalStorage({
            ...settingsContent,
            fontFamily: fontFamily
        });
    };

    // Function to increase font size
    const increaseFontSize = () => {
        setSettingsContent((prevSettings) => ({
            ...prevSettings,
            fontSize: Math.min(prevSettings.fontSize + 1, 24),
        }));
        saveSettingsToLocalStorage({
            ...settingsContent,
            fontSize: Math.min(settingsContent.fontSize + 1, 24)
        });
    };

    // Function to decrease font size
    const decreaseFontSize = () => {
        setSettingsContent((prevSettings) => ({
            ...prevSettings,
            fontSize: Math.max(prevSettings.fontSize - 1, 12),
        }));
        saveSettingsToLocalStorage({
            ...settingsContent,
            fontSize: Math.max(settingsContent.fontSize - 1, 12)
        });
    };

    // Function to save settings to local storage
    const saveSettingsToLocalStorage = (settings) => {
        localStorage.setItem('storySettings', JSON.stringify(settings));
    };

    // Intersection observer for fetching previous chapter
    const [prevFetch] = useInView({
        onChange: async (prevFetchInView) => {
            if (prevFetchInView && prevChapterUrl) {
                setPrevChapterLoading(true); // Set loading state to true
                const prevChapterData = await fetchChapterData(storyId, prevChapterUrl);
                setChapterArr((prev) => {
                    if (!prev.some(
                        (chapter) => chapter.ChapterUrl === prevChapterData.ChapterUrl
                    )) {
                        scrollToCurrentChapter();
                        return [prevChapterData, ...prev];
                    }
                    return prev;
                });
                setPrevChapterLoading(false); // Set loading state to false when data is available
            }
        },
    });

    // Intersection observer for fetching next chapter
    const [nextFetch] = useInView({
        onChange: async (nextFetchInView) => {
            if (nextFetchInView && nextChapterUrl) {
                setNextChapterLoading(true); // Set loading state to true
                const nextChapterData = await fetchChapterData(storyId, nextChapterUrl);
                setChapterArr((prev) => {
                    if (!prev.some(
                        (chapter) => chapter.ChapterUrl === nextChapterData.ChapterUrl
                    )) {
                        return [...prev, nextChapterData];
                    }
                    return prev;
                });
                setNextChapterLoading(false);
            }
        },
    });

    return (
        <>
            <div className="page story-container">
                <div className="fetch-previous" ref={prevFetch}>
                </div>
                <div className="story-inner">
                    {storyLoading ? <Loader style={{position: "absolute", top: "50%", left: "calc(50% - 5rem)", transform: "translate(-50%, -50%)"}}/> : <div className="chapters" style={{
                        backgroundColor: settingsContent.backgroundColor,
                        fontFamily: settingsContent.fontFamily,
                        fontSize: `${settingsContent.fontSize}px`,
                        color: settingsContent.backgroundColor === '#302F31' ? '#fff' : '#000'
                    }}>
                        
                    {prevChapterLoading && <Loader style={{marginInline : "auto", marginBottom: "-3rem", scale: "0.5"}}/>} {/* Render loader if previous chapter is loading */}
                        {chapterArr.map((eachChapter, index) => (
                            <Chapter
                                key={eachChapter.ChapterTitle}
                                chapterNo={eachChapter.ChapterNo}
                                title={eachChapter.ChapterTitle}
                                content={eachChapter.Story}
                                url={eachChapter.ChapterUrl}
                                id={eachChapter.ChapterNo}
                                storyId={storyId}
                                isCurrentChapter={(ref) => { currentChapterRef.current = ref.current }}
                                chapterIndex={index}
                            />
                        ))}

                        
                {nextChapterLoading && <Loader style={{marginInline : "auto", marginTop: "-3rem", scale: "0.5"}}/>} {/* Render loader if next chapter is loading */}
                    </div>}
                    <div className={storySidebarOpen ? "story-sidebar-container active" : "story-sidebar-container"}>
                        {storySidebarOptions["chapterIndex"].active && (
                            <div className="chapter-index-story-sidebar">
                                <h3>Table Of Content</h3>
                                <ul className="list-chapters">
                                    {chapterIndexContent.map((chapter, index) => (
                                        <li key={index} className={`list-chapter-item ${chapter.ChapterUrl === chapterUrl ? 'active' : ''}`}>
                                            <a href={chapter.ChapterUrl}><p>Chapter {chapter.ChapterNo}</p></a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {storySidebarOptions["settings"].active && (
                            <DisplaySettings
                                settingsContent={settingsContent}
                                handleBgColorClick={handleBgColorClick}
                                handleFontFamilyClick={handleFontFamilyClick}
                                increaseFontSize={increaseFontSize}
                                decreaseFontSize={decreaseFontSize}
                            />
                        )}
                        {storySidebarOptions["comments"].active && (
                            <div className="comments-story-sidebar">
                                <h3>Comments</h3>
                                <p>Comments content goes here...</p>
                            </div>
                        )}
                    </div>

                </div>
                <div className="fetch-next" ref={nextFetch}>
                </div>
            </div>
            <div className="story-sidebar">
                <div className="story-sidebar-menu">
                    <BtnSidebar onClick={() => handleSidebarClick("chapterIndex")}><IoIosList /></BtnSidebar>
                    <BtnSidebar onClick={() => handleSidebarClick("settings")}><IoSettingsOutline /></BtnSidebar>
                    <BtnSidebar onClick={() => handleSidebarClick("comments")}><TfiComments /></BtnSidebar>
                </div>
            </div>
        </>
    );

};

export default Story;
