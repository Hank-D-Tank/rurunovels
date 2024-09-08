import React, { useState } from "react";
import MainSlider from "../components/carousels/MainSlider";
import SingleBigCard from "../components/cards/SingleBigCard";
import SectionWithChapterCard from "../components/cards/SectionWithChapterCard";
import SidebarCard from "../components/cards/SidebarCard";
import Slider from "../components/carousels/Slider";
import SectionHeading from "../components/utilities/SectionHeading";
import BtnSecondary from "../components/buttons/BtnSecondary";
import SectionNoChapterCard from "../components/cards/SectionNoChapterCard";
import useFetch from "../components/hooks/useFetch";
import SkeletonStoryCard from "../components/loaders/SkeletonStoryCard";
import SkeletonSidebarCard from "../components/loaders/SkeletonSidebarCard";

const Home = () => {
  /* Home Slider */

  const homeSliderApiUrl =
    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getHomeSlider";
  const {
    data: homeSliderData,
    loading: homeSliderLoading,
    error: homeSliderError,
  } = useFetch(homeSliderApiUrl);
  const homeSlideArr = homeSliderData
    ? Object.values(homeSliderData.data).map((item, index) => (
        <SingleBigCard
          novelId = {item.StoryId}
          novelCoverImg={item.Image}
          novelTitle={item.Title}
          novelSynopsis={item.Description}
          novelChapters={item.TotalChapters}
          novelRating={item.Rating + "/10"}
          novelVotes={item.Votes}
        />
      ))
    : [];
  
    

  /* Home Slider */

  /* Recent Updates */

  const recentUpdatesApiUrl =
    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getHomeRecentUpdates";
  const {
    data: recentUpdatesData,
    loading: recentUpdatesLoading,
    error: recentUpdatesError,
  } = useFetch(recentUpdatesApiUrl);
  console.log(recentUpdatesData)
  const recentUpdatesArr = recentUpdatesData
    ? Object.values(recentUpdatesData.data).map((item, index) => (
        <SectionWithChapterCard
          novelId={Object.keys(recentUpdatesData.data)[index]}
          novelCoverImg={item.StoryImage}
          novelLatestChapters={Object.values(item.Chapters).map(
            (chapter, index) => ({
              chapterUrl: chapter.ChapterUrl,
              chapterNumber: chapter.ChapterNumber,
              chapterTitle: chapter.ChapterTitle,
              chapterTags: chapter.ChapterTags,
              chapterTime: chapter.UploadTime,
            })
          )}
          novelTitle={item.StoryTitle}
          novelSynopsis={item.StorySummary}
          novelTags={item.StoryTags}
        />
      ))
    : [];


  /* Recent Updates */

  /* Time */
  /* Time */

  /* Get All Stories API */

  /* True Genre Only Function */    

  const get2TrueGenres = (genres) => {
    return Object.entries(genres)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
      .slice(0, 2);
  };

  const getAllTrueGenres = (genres) => {
    return Object.entries(genres)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
  };

  /* True Genre Only Function */   

  const popularApiUrl =
    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/filterStories?tag=Popular";
  const {
    data: popularData,
    loading: popularLoading,
    error: popularError,
  } = useFetch(popularApiUrl);
  const popularArr = popularData
    ? Object.values(popularData.data).slice(0, 8).map((item, index) => (
        <SectionNoChapterCard
        novelId={item.StoryId}
        novelCoverImg={item.StoryImage}
        novelTitle={item.StoryTitle}
        novelSynopsis={item.Summary}
        novelTags={item.Genres ? get2TrueGenres(item.Genres) : []}
        />
      ))
    : [];

    const hotPicksApiUrl =
    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/filterStories?tag=Hot+Picks";
  const {
    data: hotPicksData,
    loading: hotPicksLoading,
    error: hotPicksError,
  } = useFetch(hotPicksApiUrl);
  const hotPicksArr = hotPicksData
    ? Object.values(hotPicksData.data).slice(0, 8).map((item, index) => (
        <SectionNoChapterCard
        novelId={item.StoryId}
        novelCoverImg={item.StoryImage}
        novelTitle={item.StoryTitle}
        novelSynopsis={item.Summary}
        novelTags={item.Genres ? get2TrueGenres(item.Genres) : []}
        />
      ))
    : [];
    
    const recommendedApiUrl =
    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/filterStories?tag=Recommended";
  const {
    data: recommendedData,
    loading: recommendedLoading,
    error: recommendedError,
  } = useFetch(recommendedApiUrl);
  const recommendedArr = recommendedData
    ? Object.values(recommendedData.data).slice(0, 8).map((item, index) => (
      <SidebarCard
      novelId={item.StoryId}
      novelCoverImg={item.StoryImage}
      novelTitle={item.StoryTitle}
      novelRating={item.Ratings + "/10.0"}
      novelRatingPercent={parseFloat(item.Ratings) * 10 + "%"}
      novelVotes={item.Votes}
      novelGenre={getAllTrueGenres(item.Genres)}
    />
      ))
    : [];

  /* Get All Stories API */

  return (
    <div className="page container-fluid home-footer">
      <div className="row">
        <div className="col-md-12">
          {
            <MainSlider
              slides={homeSlideArr}
              isLoading={homeSliderLoading}
            ></MainSlider>
          }
        </div>
      </div>
      <div className="row mt-5">
        <SectionHeading heading={"Latest Releases"} haveButtons={true}>
          <BtnSecondary to="/library/filter?timeUploaded=true"> See More</BtnSecondary>
        </SectionHeading>
        <div className="col-md-12">
          {
            <Slider
              slides={recentUpdatesArr}
              isLoading={recentUpdatesLoading}
            ></Slider>
          }
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg-8 col-md-7">
          <div className="col-12">
            <SectionHeading heading={"Popular"} haveButtons={true}>
              <BtnSecondary to="/library/filter?tag=Popular"> See More</BtnSecondary>
            </SectionHeading>
           <div className="row gy-4">
            {!popularLoading ? popularArr.map((item, index) => <div className="col-lg-3 col-md-6 col-sm-6" key={index}>{item}</div>) : <SkeletonStoryCard hasChapters = {false} quantity={4}></SkeletonStoryCard>}
           </div>
          </div> 
          <div className="col-12 mt-5">
            <SectionHeading heading={"Hot Picks"} haveButtons={true}>
              <BtnSecondary to="/library/filter?tag=Hot+Picks"> See More</BtnSecondary>
            </SectionHeading>
           <div className="row gy-4">
            {!hotPicksLoading ? hotPicksArr.map((item, index) => <div className="col-lg-3 col-md-6 col-sm-6" key={index}>{item}</div>) : <SkeletonStoryCard hasChapters = {false} quantity={4}></SkeletonStoryCard>}
           </div>
          </div> 
        </div>
        <div className="col-lg-4 col-md-5">
          <SectionHeading heading={"Recommended"}></SectionHeading>
          <div className="row gy-4">
            {!recommendedLoading ? recommendedArr.map((item, index) => <div className="col-12" key={index}>{item}</div>) : <SkeletonSidebarCard quantity={5}></SkeletonSidebarCard>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
