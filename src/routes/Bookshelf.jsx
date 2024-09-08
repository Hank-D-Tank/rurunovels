import React, { useEffect, useState } from 'react';
import Filter from '../components/utilities/Filter';
import { useSearchParams } from 'react-router-dom';
import Loader from '../components/loaders/Loader';
import SectionNoChapterCard from '../components/cards/SectionNoChapterCard';
import notFound from '../assets/not-found.svg';
import usePostFetch from '../components/hooks/usePostFetch';
import useFetch from '../components/hooks/useFetch';
import { toast, ToastContainer } from 'react-toastify';
import SectionWithChapterCard from '../components/cards/SectionWithChapterCard';

const Bookshelf = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [filterCategories, setFilterCategories] = useState([]);
  let [searchParams] = useSearchParams();

  const apiUrls = {
    languages: 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllLanguages',
    contentStatus: 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllContentStatus',
    contentType: 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllContentType',
    genres: 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllGenres',
    sorts: 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllSorts',
    allStories: 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/filterStoryByTitle?title=',
    bookmarks: 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/getMyBookmarks',
  };

  const fetchConfigs = [
    { key: 'languagesData', url: apiUrls.languages },
    { key: 'contentStatusData', url: apiUrls.contentStatus },
    { key: 'contentTypeData', url: apiUrls.contentType },
    { key: 'genresData', url: apiUrls.genres },
    { key: 'sortsData', url: apiUrls.sorts },
  ];

  const fetchResults = fetchConfigs.reduce((acc, { key, url }) => {
    const { data, loading, error } = useFetch(url);
    return { ...acc, [key]: data, [`${key}Loading`]: loading, [`${key}Error`]: error };
  }, {});

  const {
    languagesData,
    languagesDataLoading,
    contentStatusData,
    contentStatusDataLoading,
    contentTypeData,
    contentTypeDataLoading,
    genresData,
    genresDataLoading,
    sortsData,
    sortsDataLoading,
  } = fetchResults;

  useEffect(() => {
    if (
      !languagesDataLoading &&
      !contentStatusDataLoading &&
      !contentTypeDataLoading &&
      !genresDataLoading &&
      !sortsDataLoading &&
      languagesData &&
      contentStatusData &&
      contentTypeData &&
      genresData &&
      sortsData
    ) {
      const constructFilters = (title, url, data, includeAll = false) => {
        const filters = Object.keys(data).map((key) => ({
          name: key,
          url: key,
          active: false,
        }));

        if (includeAll) {
          filters.unshift({ name: 'All', url: 'all', active: false });
        }

        return {
          title,
          url,
          filters,
        };
      };

      const dynamicFilters = [
        constructFilters('Content Type', 'contentType', contentTypeData.data, true),
        constructFilters('Content Status', 'status', contentStatusData.data),
        constructFilters('Content Language', 'language', languagesData.data),
        constructFilters('Sort By', 'tag', sortsData.data),
        constructFilters('Select Genre', 'genre', genresData.data),
      ];

      setFilterCategories(dynamicFilters);
    }
  }, [
    languagesDataLoading,
    contentStatusDataLoading,
    contentTypeDataLoading,
    genresDataLoading,
    sortsDataLoading,
    languagesData,
    contentStatusData,
    contentTypeData,
    genresData,
    sortsData,
  ]);

  const { data: allStoryData, loading: allStoryLoading, error: allStoryError } = useFetch(apiUrls.allStories);
  const { data: bookmarksData, loading: bookmarksLoading, error: bookmarksError } = usePostFetch(apiUrls.bookmarks, user.accessToken, { userId: user.uid }, []);
  console.log(bookmarksData)

  const getTrueGenres = (genres) => {
    return Object.entries(genres)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
      .slice(0, 2);
  };

  const filteredBookmarks = allStoryData?.data?.filter((story) =>
    bookmarksData?.data?.hasOwnProperty(story.StoryId)
  ).map((story) => ({
    ...story,
    ChapterId: bookmarksData.data[story.StoryId].ChapterId,
    ChapterNo: bookmarksData.data[story.StoryId].ChapterNo,
    ChapterUrl: bookmarksData.data[story.StoryId].ChapterUrl,

  })) || [];

  console.log(filteredBookmarks)

  return (
    <div className="page container-fluid library">
      {/* <Filter
        filterHeading="Filter"
        filterCategories={filterCategories}
        baseUrl="/bookshelf"
        setFilterCategories={setFilterCategories}
        loaderIsActive={bookmarksLoading}
      /> */}
      <div className="row mt-5">
        {bookmarksLoading ? (
          <Loader
            style={{
              position: 'absolute',
              top: '50%',
              left: 'calc(50% + 0.5rem)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ) : filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((eachData) => (
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-5 bookmarks-section-cards" key={eachData.StoryId}>
              <SectionWithChapterCard
                novelId={eachData.StoryId}
                novelCoverImg={eachData.StoryImage}
                novelTitle={eachData.StoryTitle}
                novelSynopsis={eachData.Summary}
                novelTags={getTrueGenres(eachData.Genres)}
                novelLatestChapters={
                  [{
                    chapterUrl: eachData.ChapterUrl,
                    chapterNumber: eachData.ChapterNo,

                  }]
                }
              />
            </div>
          ))
        ) : (
          <div className="col-12 not-found">
            <img src={notFound} alt="Not found" />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Bookshelf;
