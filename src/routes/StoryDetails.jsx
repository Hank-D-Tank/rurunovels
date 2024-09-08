import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SingleDetailCard from "../components/cards/SingleDetailCard";
import CardWithHeading from "../components/cards/CardWithHeading";
import SkeletonSingleDetailCard from "../components/loaders/SkeletonSingleDetailCard";
import useFetch from "../components/hooks/useFetch";
import { MdOutlineStar } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoryDetails = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { storyId } = useParams();
    const storyAboutApiUrl = `https://us-central1-cb-story-app-27012024.cloudfunctions.net/getStoryIndex?storyId=${storyId}`;
    const {
        data: storyAboutData,
        loading: storyAboutLoading,
        error: storyAboutError,
    } = useFetch(storyAboutApiUrl, {}, {}, [storyId]);

    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [ratingError, setRatingError] = useState(null);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [initialRatingSet, setInitialRatingSet] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchInitialRating = async () => {
            if (user) {
                try {
                    const response = await fetch('https://us-central1-cb-story-app-27012024.cloudfunctions.net/getUsersVoteSingleStory', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.accessToken}`,
                        },
                        body: JSON.stringify({ userId: user.uid, storyId }),
                    });

                    if (response.ok) {
                        const initialRatingData = await response.json();
                        if (initialRatingData.success && !initialRatingSet) {
                            setRating(initialRatingData.data);
                            setInitialRatingSet(true);
                        }
                    } else {
                        console.error('Failed to fetch initial rating');
                    }
                } catch (error) {
                    console.error('Failed to fetch initial rating:', error);
                }
            }
        };

        const fetchBookmarks = async () => {
            if (user) {
                try {
                    const response = await fetch('https://us-central1-cb-story-app-27012024.cloudfunctions.net/getMyBookmarks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.accessToken}`,
                        },
                        body: JSON.stringify({ userId: user.uid }),
                    });

                    if (response.ok) {
                        const bookmarksData = await response.json();
                        if (bookmarksData.success) {
                            const bookmarksArray = Object.keys(bookmarksData.data);
                            setSaved(bookmarksArray.includes(storyId));
                        }
                    } else {
                        console.error('Failed to fetch bookmarks');
                    }
                } catch (error) {
                    console.error('Failed to fetch bookmarks:', error);
                }
            }
        };

        fetchInitialRating();
        fetchBookmarks();
    }, [user, storyId, initialRatingSet]);

    const handleRating = async (newRating) => {
        if (!user) return; // Early return if user is not logged in

        setRating(newRating);
        setSubmitted(true);
        setRatingLoading(true);
        setRatingError(null);

        toast.promise(
            fetch('https://us-central1-cb-story-app-27012024.cloudfunctions.net/rateStory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({ userId: user.uid, storyId, rating: newRating }),
            }).then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Failed to submit rating');
                    });
                }
                return response.json();
            }),
            {
                pending: "Submitting your rating...",
                success: "Thank you for your rating!",
                error: {
                    render({ data }) {
                        setRatingError(data.message);
                        return `Error: ${data.message}`;
                    },
                },
            }
        ).finally(() => {
            setRatingLoading(false);
        });
    };

    const saveBtnEvent = (storyId, userId, chapterId) => {
        if (!user) return; // Early return if user is not logged in

        setSaving(true);
        const removeBookmarkApiUrl = 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/addBookmarks';
        const addBookmarkApiUrl = 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/addBookmarks';
        const apiUrl = saved ? removeBookmarkApiUrl : addBookmarkApiUrl;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify({ storyId, userId, chapterId }),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(errorData.message || 'Failed to update bookmark');
                });
            }
            return response.json();
        })
        .then(() => {
            toast.success(`Bookmark ${saved ? 'removed' : 'added'} successfully!`);
            setSaved(!saved);
        })
        .catch((error) => {
            toast.error(`Error: ${error.message}`);
        })
        .finally(() => {
            setSaving(false);
        });
    };

    return (
        <div className="page story-about row">
            <div className="col-12">
                {storyAboutLoading ? (
                    <SkeletonSingleDetailCard />
                ) : (
                    storyAboutData && (
                        <SingleDetailCard
                            novelId={storyId}
                            novelCoverImg={storyAboutData.properties.StoryImage}
                            novelTitle={storyAboutData.properties.StoryTitle}
                            novelAuthor={storyAboutData.properties.StoryAuthor}
                            novelChapters={storyAboutData.data.length}
                            novelStatus={storyAboutData.properties.FilterByContentStatus}
                            novelRating={storyAboutData.properties.StoryRatings}
                            novelVotes={storyAboutData.properties.Votes}
                            novelViews={storyAboutData.properties.Votes}
                            readingChapter={storyAboutData.data.length > 0 ? storyAboutData.data[0].ChapterUrl : '#'}
                            saveBtnEvent={() => saveBtnEvent(storyId, user.uid, storyAboutData.data[0].Id)}
                            saved={saved}
                            saving={saving}
                        />
                    )
                )}
            </div>

            <ToastContainer />

            {!storyAboutLoading && storyAboutData && (
                <div className="col-12" style={{ height: "fit-content", marginTop: "2rem" }}>
                    <div className="row gy-4 mb-5" style={{ height: "100%" }}>
                        <div className="col-md-7" style={{ minHeight: "100%" }}>
                            <CardWithHeading
                                cardHeading="Synopsis"
                                className="story-details-summary mb-4"
                                style={{
                                    lineHeight: "1.8",
                                    textAlign: "justify",
                                    height: "100%",
                                    marginTop: "0",
                                }}
                            >
                                {storyAboutData.properties.Summary}

                                <div className="card-with-heading-genre mt-auto">
                                    {Object.entries(storyAboutData.properties.FilterByGenre).map(([genre, value], index) => {
                                        return value ? <Link key={index} to={'/library/filter?genre=' + genre} className={"badge " + genre.toLowerCase()}>{genre}</Link> : null;
                                    })}
                                </div>
                            </CardWithHeading>
                        </div>
                        <div className="col-md-5" style={{ minHeight: "100%" }}>
                            <CardWithHeading
                                cardHeading="Table Of Contents"
                                className="content-list"
                                style={{
                                    lineHeight: "1.8",
                                    textAlign: "justify",
                                    height: "100%",
                                    marginTop: "0",
                                }}
                            >
                                <ul className="list-chapters">
                                    {storyAboutData.data.map((chapter, index) =>
                                        <li className="list-item" key={index}>
                                            <Link to={`/reading/${storyId}/${chapter.ChapterUrl}`}>Chapter {chapter.ChapterNo}</Link>
                                        </li>
                                    )}
                                </ul>
                            </CardWithHeading>
                        </div>
                    </div>
                </div>
            )}

            {user && !storyAboutLoading && <div className="col-md-4">
                <div className="card-with-heading card-with-heading-background mt-0">
                    <div className="card-heading">Please Rate {storyAboutData.properties.StoryTitle}</div>
                    <div className="card-rating">
                        {[...Array(5)].map((_, index) => (
                            <span
                                key={index}
                                className={`rating-star ${(index * 2) < rating ? 'selected' : ''}`}
                                onClick={() => handleRating((index + 1) * 2)}
                            >
                                <MdOutlineStar />
                            </span>
                        ))}
                    </div>
                    {submitted && !ratingLoading && (
                        <div className="rating-message">
                            {ratingError ? `Error: ${ratingError}` : 'Thank you for your rating!'}
                        </div>
                    )}
                </div>
            </div>}
        </div>
    );
};

export default StoryDetails;
