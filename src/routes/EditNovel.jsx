import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../components/form/Input";
import { FaCrown, FaPenNib } from "react-icons/fa";
import Autocomplete from "../components/form/Autocomplete";
import { IoMdArrowDropdown } from "react-icons/io";
import Textarea from "../components/form/Textarea";
import Multiselect from "../components/form/Multiselect";
import { PiBookOpenText } from "react-icons/pi";
import BtnPrimary from "../components/buttons/BtnPrimary";
import { MdDelete, MdEdit } from "react-icons/md";
import CardWithBackground from "../components/cards/CardWithBackground";
import CardWithHeading from "../components/cards/CardWithHeading";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { IoAdd } from "react-icons/io5";
import notFound from "../assets/not-found.svg";
import { useNavigate, useParams } from "react-router-dom";
import usePostFetch from "../components/hooks/usePostFetch";
import useCurrentTimeInIST from "../components/hooks/useCurrentTimeInIST";

const languages = ["English", "Spanish", "French", "German", "Chinese"];
const contentStatus = ["Ongoing", "Completed", "Dropped", "OnHiatus"];
const contentType = ["Original", "Translated"];
const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Romance",
    "Drama",
    "Fantasy",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Mystery",
    "Young Adult",
    "Adult",
    "Children",
    "Novel",
    "Short Story",
    "Novella",
    "Bestseller",
    "Award Winning",
    "Martial Arts",
    "Murim",
    "System",
    "Revenge",
    "Sports",
    "Supernatural",
    "Slice of Life",
    "Urban Fantasy",
    "Dystopian",
    "Post Apocalyptic",
    "Magical Realism",
    "Tragedy",
    "Psychological",
    "Cyberpunk",
    "Mecha",
    "Historical Romance",
    "Paranormal",
    "Satire",
    "Biography",
    "Autobiography",
    "Spiritual",
    "Social Issues",
    "Dark Fantasy",
    "Isekai",
];

const accessType = ["Free", "Premium"];

const EditNovel = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { storyId } = useParams();
    const [status, setStatus] = useState(null);
    const [initialSelectedGenres, setInitialSelectedGenres] = useState([]);
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
    const navigate = useNavigate();
    const timeInIST = useCurrentTimeInIST();
    const storyDataUrl = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAuthorStoryDetail";
    const chaptersUrl = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllChapters";
    const { data: storyPrevData, loading: storyPrevLoading, error: storyPrevError } = usePostFetch(storyDataUrl, user.accessToken, { userId: user.uid, storyId: storyId }, [storyId]);
    const { data: chaptersData, loading: chaptersDataLoading, error: chaptersDataError } = usePostFetch(chaptersUrl, user.accessToken, { userId: user.uid, storyId: storyId });
    const [chapters, setChapters] = useState({});

    const [formData, setFormData] = useState({
        userId: user && user.uid,
        storyId: storyId,
        title: "",
        author: "",
        language: "",
        contentStatus: "",
        accessType: "",
        sorts: {
            "Editors Choice": false,
            "Hot Picks": false,
            "New Arrivals": false,
            "Popular": false,
            "Recommended": false
        },
        contentType: "",
        summary: "",
        genres: {},
        coverImage: null,
        lastUpdated: timeInIST
    });


    useEffect(() => {
        if (storyPrevData) {
            setFormData({
                userId: user && user.uid,
                storyId: storyId,
                title: storyPrevData.data.StoryTitle,
                author: storyPrevData.data.StoryAuthor,
                language: storyPrevData.data.StoryLanguage,
                contentStatus: storyPrevData.data.FilterByContentStatus,
                accessType: storyPrevData.data.AccessType,
                sorts: storyPrevData.data.FilterBySort,
                contentType: storyPrevData.data.FilterByContentType,
                summary: storyPrevData.data.Summary,
                genres: storyPrevData.data.FilterByGenre,
                coverImage: storyPrevData.data.StoryImage,
                lastUpdated: timeInIST
            })
            setInitialSelectedGenres(Object.keys(storyPrevData.data.FilterByGenre).filter(
                (key) => storyPrevData.data.FilterByGenre[key]
            ));
            setStatus(storyPrevData.data.PublishStatus)
        }
    }, [storyPrevData]);

    useEffect(() => {
        if(chaptersData){
            setChapters(chaptersData.chapters)
        }
    }, [chaptersData]);

    const [errors, setErrors] = useState({});
    const [resetGenres, setResetGenres] = useState(false);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleGenreChange = (selectedGenres) => {
        const genreObj = {};
        genres.forEach((genre) => {
            genreObj[genre] = selectedGenres.includes(genre);
        });
        handleChange("genres", genreObj);
    };

    const handleSubmit = () => {
        const validationErrors = validateFormData();
        if (Object.keys(validationErrors).length === 0) {
            confirmAlert({
                title: "Confirm Submission 😀",
                message:
                    "Are you sure you want to submit the form with the provided information?",
                buttons: [
                    {
                        label: "Yes",
                        onClick: () => {
                            handleFormSubmit();
                        },
                    },
                    {
                        label: "No",
                    },
                ],
            });
        } else {
            setErrors(validationErrors);
            confirmAlert({
                title: "Validation Errors/Bugs 🐛",
                message: (
                    <ul className="modal-list">
                        {Object.values(validationErrors).map((error, index) => (
                            <li className="modal-list-item" key={index}>
                                {error}
                            </li>
                        ))}
                    </ul>
                ),
                buttons: [
                    {
                        label: "Close",
                    },
                ],
            });
        }
    };

    const handleFormSubmit = async () => {
        try {
            const response = await toast.promise(
                fetch('https://us-central1-cb-story-app-27012024.cloudfunctions.net/updateStory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`,
                    },
                    body: JSON.stringify(formData),
                }).then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message || 'Something went wrong');
                        });
                    }
                    return response.json();
                }),
                {
                    pending: 'Submitting your novel...',
                    success: {
                        render({ data }) {
                            setStatus(data.status);
                            setFormSubmitSuccess(true);
                            return 'Your form has been successfully updated';
                        }
                    },
                    error: {
                        render({ data }) {
                            return `Error: ${data.message}`;
                        }
                    }
                }
            );
            setErrors({});
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const validateFormData = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = "Title is required";
        }

        if (!formData.author.trim()) {
            errors.author = "Author is required";
        }

        if (!formData.language) {
            errors.language = "Language is required";
        }

        if (!formData.contentStatus) {
            errors.contentStatus = "Content Status is required";
        }

        if (!formData.accessType) {
            errors.accessType = "Content Access Type is required";
        }

        if (!formData.contentType) {
            errors.contentType = "Content Type is required";
        }

        if (!formData.summary.trim()) {
            errors.summary = "Summary is required";
        }

        const selectedGenres = Object.values(formData.genres).filter(Boolean);
        if (selectedGenres.length === 0) {
            errors.genres = "At least one genre must be selected";
        }

        return errors;
    };

    const handleDelete = (deleteChapterId, chapterTitle) => {
        confirmAlert({
            title: "Confirm Deletion 😔",
            message: `Are you sure you want to delete ${chapterTitle}?`,
            buttons: [
                {
                    label: "Yes, delete it",
                    onClick: () => {
                        deleteChapter(deleteChapterId);
                    },
                },
                {
                    label: "No, don't",
                },
            ],
        });
    };

    const deleteChapter = async (chapterId) => {
        try {
            const response = await toast.promise(
                fetch('https://us-central1-cb-story-app-27012024.cloudfunctions.net/deleteChapter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`,
                    },
                    body: JSON.stringify({userId: user.uid, storyId: storyId, chapterId: chapterId}),
                }).then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message || 'Something went wrong');
                        });
                    }
                    return response.json();
                }),
                {
                    pending: 'Deleting your chapter...',
                    success: {
                        render({ data }) {
                            const filteredChapters = Object.fromEntries(
                                Object.entries(chapters).filter(([key]) => key !== chapterId)
                              );
                              setChapters(filteredChapters);
                              console.log(chapters)
                            return 'Your chapter has been successfully deleted.';
                        }
                    },
                    error: {
                        render({ data }) {
                            return `Error: ${data.message}`;
                        }
                    }
                }
            );
            setErrors({});
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const editChapter = (chapterId) => {
        navigate(`/${user.uid}/edit/novel/${storyId}/chapter/${chapterId}`)
    };

    return (
        <div className="page container-fluid">
            <ToastContainer />
            {storyPrevLoading ? (
                <div className="loader" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}></div>
            ) : (
                <div className="row form-holder">
                    <div className="col-md-8 form-holder-left">
                        <CardWithBackground cardHeading="Novel Details :">
                            <div className="row gy-4">
                                <div className="col-md-10"></div>
                                <div className="col-md-2 d-flex align-items-start">
                                    {status && <div className={"badge ms-auto " + status.toLowerCase()}>{status}</div>}
                                </div>
                                <div className="col-md-6">
                                    <Autocomplete
                                        isLoading={false}
                                        placeholder={"Content Type"}
                                        icon={<IoMdArrowDropdown />}
                                        data={contentType}
                                        value={formData.contentType}
                                        onChange={(value) => handleChange("contentType", value)}
                                        animate={false}
                                        error={errors.contentType}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Autocomplete
                                        isLoading={false}
                                        placeholder={"Is It Free Or Premium ?"}
                                        icon={<IoMdArrowDropdown />}
                                        data={accessType}
                                        value={formData.accessType}
                                        onChange={(value) => handleChange("accessType", value)}
                                        animate={false}
                                        error={errors.accessType}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        placeholder={"Novel/Story's Title"}
                                        icon={<FaPenNib />}
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        animate={false}
                                        error={errors.title}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        placeholder={"Author/Writer's Name"}
                                        icon={<FaCrown />}
                                        value={formData.author}
                                        onChange={(e) => handleChange("author", e.target.value)}
                                        animate={false}
                                        error={errors.author}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Autocomplete
                                        isLoading={false}
                                        placeholder={"Language"}
                                        icon={<IoMdArrowDropdown />}
                                        data={languages}
                                        value={formData.language}
                                        onChange={(value) => handleChange("language", value)}
                                        animate={false}
                                        error={errors.language}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Autocomplete
                                        isLoading={false}
                                        placeholder={"Content Status"}
                                        icon={<IoMdArrowDropdown />}
                                        data={contentStatus}
                                        value={formData.contentStatus}
                                        onChange={(value) => handleChange("contentStatus", value)}
                                        animate={false}
                                        error={errors.contentStatus}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <Textarea
                                        placeholder={"Summary"}
                                        icon={<PiBookOpenText />}
                                        value={formData.summary}
                                        onChange={(e) => handleChange("summary", e.target.value)}
                                        animate={false}
                                        error={errors.summary}
                                        style={{ height: "15rem" }}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <Multiselect
                                        genresList={genres}
                                        initialSelectedGenres={initialSelectedGenres}
                                        onChange={handleGenreChange}
                                        placeholder="Select Genre/Genres"
                                        error={errors.genres}
                                        reset={resetGenres}
                                        onResetComplete={() => setResetGenres(false)}
                                    />
                                </div>
                                <div className="col-12 mt-5">
                                    {!formSubmitSuccess && (
                                        <BtnPrimary onClick={handleSubmit} style={{ width: "fit-content" }}>
                                            Submit
                                        </BtnPrimary>
                                    )}
                                </div>
                            </div>
                        </CardWithBackground>
                    </div>
                    <div className="col-md-4 form-holder-right">
                        <CardWithHeading
                            cardHeading="Chapter Lists"
                            className="content-list"
                            style={{
                                lineHeight: "1.8",
                                textAlign: "justify",
                                minHeight: "calc(100% - 4rem)",
                                marginTop: "2rem",
                                marginBottom: "2rem",
                            }}
                        >
                            <BtnPrimary
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "1.3rem",
                                    marginBottom: "1rem",
                                    position: "absolute",
                                    top: "1.5rem",
                                    right: "2rem",
                                }}
                                to={`/${user.uid}/create/novel/${storyId}/chapter`}
                            >
                                <IoAdd style={{ fontSize: "2rem" }} /> Chapter
                            </BtnPrimary>
                            <ul className="list-chapters" style={{ position: "relative", minHeight: "30rem" }}>
                                {chapters ? (
                                    Object.entries(chapters).map(([key, chapter], index) => (
                                        <li className="list-item" style={{ padding: "0.7rem 1rem" }} key={key}>
                                            <p>{chapter.ChapterNo} : {chapter.ChapterTitle}</p>
                                            <div className="edit" onClick={() => editChapter(key)}>
                                                <MdEdit />
                                            </div>
                                            <div className="delete" onClick={() => handleDelete(key, chapter.ChapterTitle)}>
                                                <MdDelete />
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <img src={notFound} alt="Not found" style={{ position: "absolute", top: "10%", left: "50%", transform: "translate(-100%, -50%)", scale: "0.5" }} />
                                )}

                            </ul>
                        </CardWithHeading>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditNovel;