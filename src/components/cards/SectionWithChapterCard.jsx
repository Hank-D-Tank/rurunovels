import React from 'react';
import { Link } from 'react-router-dom';
import useTimeFormat from '../hooks/useTimeFormat';

const SectionWithChapterCard = ({ novelId, novelCoverImg, novelLatestChapters, novelTitle, novelSynopsis, novelTags }) => {
  return (
    <div className="single-card">
      <div className="single-card-bg-image">
        <img src={novelCoverImg} alt={"Cover Image Of " + novelTitle } />
      </div>
      <div className="single-card-info">
        <div className="single-card-novel-released-chapter">
          {novelLatestChapters.map((chapter, index) => {
            const formattedTime = useTimeFormat(Number(chapter.chapterTime)); 
            return (
              <p key={index} style={{cursor: "pointer"}}>
                <Link to={'/reading/' + novelId + '/' + chapter.chapterUrl} style={{display: "flex", alignItems: "center", width: "100%"}}>
                  Chapter {chapter.chapterNumber}{' '}
                  {chapter.chapterTags && chapter.chapterTags.map((chapterTag, index) => (
                    <span key={index} className='badge new-small'>{chapterTag}</span>
                  ))}{' '}
                  <span className="single-card-novel-chapter-released-time">{chapter.chapterTime && formattedTime}</span>
                </Link>
              </p>
            );
          })}
        </div>
        <div className="single-card-novel-title">
          <p style={{cursor: "pointer"}}> <Link to={'/about/' + novelId + '/'}>{novelTitle}</Link></p>
        </div>
        <div className="single-card-novel-description">
          <p>{novelSynopsis}</p>
        </div>
        <div className="single-card-novel-genre">
          {novelTags.map((novelTag, index) => (
            <Link to={`/library/filter?genre=${novelTag}`} key={index} className={"badge " + novelTag.toLowerCase()}>{novelTag}</Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWithChapterCard;
