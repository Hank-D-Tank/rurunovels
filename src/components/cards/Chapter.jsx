import React, { useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { GiWhiteBook } from 'react-icons/gi';

const Chapter = ({ chapterNo, title, content, url, id, storyId, isCurrentChapter }) => {
    const navigate = useNavigate();
    const ref = useRef();
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.1,
        onChange: (inView, entry) => {
            if (inView && entry.intersectionRatio > 0) {
                navigate(`/reading/${storyId}/${url}`);
            }
        }
    });

    const setRefs = useCallback(
        (node) => {
            ref.current = node;
            inViewRef(node);
            isCurrentChapter(ref);
        },
        [inViewRef],
    );

    //console.log(ref.current)

    /*     useEffect(() => {
            if (isCurrentChapter && ref.current) {
                isCurrentChapter(ref);
            }
        }, [isCurrentChapter]); */

    return (
        <div
            ref={setRefs}
            className='chapter'
            id={url}
            /* style={{
                backgroundColor: inView ? 'green' : 'gray',
                transition: 'background-color 0.3s ease',
            }} */
        >
            <div className="chapter-inner">
                <h2>Chapter {chapterNo} : {title}</h2>
                <div className="content" dangerouslySetInnerHTML={{__html: content}}></div>
                <div className="chapter-end">
                    <div className="chapter-end-bar"></div>
                    <GiWhiteBook />
                    <div className="chapter-end-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default Chapter;
