import React, { useEffect, useState } from "react";
import Filter from "../components/utilities/Filter";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/loaders/Loader";
import SectionNoChapterCard from "../components/cards/SectionNoChapterCard";
import notFound from "../assets/not-found.svg";
import useFetch from "../components/hooks/useFetch";

const Library = () => {
  const [filterCategories, setFilterCategories] = useState([]);
  let [searchParams] = useSearchParams();
  const [libraryApiUrl, setLibraryApiUrl] = useState("");

  // Fetch functions for each filter category
  const getAllLanguagesUrl = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllLanguages";
  const getAllContentStatusUrl = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllContentStatus";
  const getAllContentTypeUrl = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllContentType";
  const getAllGenresUrl = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllGenres";
  const getAllSortsUrl = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllSorts";

  const {
    data: languagesData,
    loading: languagesLoading,
    error: languagesError,
  } = useFetch(getAllLanguagesUrl);

  const {
    data: contentStatusData,
    loading: contentStatusLoading,
    error: contentStatusError,
  } = useFetch(getAllContentStatusUrl);

  const {
    data: contentTypeData,
    loading: contentTypeLoading,
    error: contentTypeError,
  } = useFetch(getAllContentTypeUrl);

  const {
    data: genresData,
    loading: genresLoading,
    error: genresError,
  } = useFetch(getAllGenresUrl);

  const {
    data: sortsData,
    loading: sortsLoading,
    error: sortsError,
  } = useFetch(getAllSortsUrl);

  useEffect(() => {
    if (
      !languagesLoading &&
      !contentStatusLoading &&
      !contentTypeLoading &&
      !genresLoading &&
      !sortsLoading &&
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
          filters.unshift({ name: "All", url: "all", active: false });
        }

        return {
          title,
          url,
          filters,
        };
      };

      const dynamicFilters = [
        constructFilters("Content Type", "contentType", contentTypeData.data, true),
        constructFilters("Content Status", "status", contentStatusData.data),
        constructFilters("Content Language", "language", languagesData.data),
        constructFilters("Sort By", "tag", sortsData.data),
        constructFilters("Select Genre", "genre", genresData.data),
      ];

      setFilterCategories(dynamicFilters);
    }
  }, [
    languagesLoading,
    contentStatusLoading,
    contentTypeLoading,
    genresLoading,
    sortsLoading,
    languagesData,
    contentStatusData,
    contentTypeData,
    genresData,
    sortsData,
  ]);

  useEffect(() => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    const constructUrl = (params) => {
      const baseUrl = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/filterStories";
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      return `${baseUrl}?${queryString}`;
    };

    const url = constructUrl(paramsObj);
    setLibraryApiUrl(url);
  }, [searchParams]);

  const {
    data: libraryData,
    loading: libraryLoading,
    notFound: libraryNotFound,
    error: libraryError,
  } = useFetch(libraryApiUrl, {}, {}, [libraryApiUrl], true);

  const getTrueGenres = (genres) => {
    return Object.entries(genres)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
      .slice(0, 2);
  };

  return (
    <div className="page container-fluid library">
      <Filter
        filterHeading="Filter"
        filterCategories={filterCategories}
        baseUrl="/library"
        setFilterCategories={setFilterCategories}
        loaderIsActive={libraryLoading}
      />
      <div className="row mt-5">
        {libraryLoading ? (
          <Loader
            style={{
              position: "absolute",
              top: "50%",
              left: "calc(50% + 0.5rem)",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : libraryData && libraryData.data && libraryData.data.length > 0 ? (
          libraryData.data.map((eachData) => (
            <div
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-5"
              key={eachData.StoryId}
            >
              <SectionNoChapterCard
                novelId={eachData.StoryId}
                novelCoverImg={eachData.StoryImage}
                novelTitle={eachData.StoryTitle}
                novelSynopsis={eachData.Summary}
                novelTags={getTrueGenres(eachData.Genres)}
              />
            </div>
          ))
        ) : libraryNotFound ? (
          <div className="col-12 not-found">
            <img src={notFound} alt="Not found" />
          </div>
        ) : (
          <Loader
            style={{
              position: "absolute",
              top: "50%",
              left: "calc(50% - 5rem)",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Library;
