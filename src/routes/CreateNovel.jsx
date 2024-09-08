import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../components/form/Input";
import { FaCrown, FaPenNib } from "react-icons/fa";
import Autocomplete from "../components/form/Autocomplete";
import { IoMdArrowDropdown } from "react-icons/io";
import FileUpload from "../components/form/FileUpload";
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
import useFetch from "../components/hooks/useFetch";

const CreateNovel = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [storyId, setStoryId] = useState(null);
    const [status, setStatus] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [contentStatus, setContentStatus] = useState([]);
    const [contentType, setContentType] = useState([]);
    const [genres, setGenres] = useState([])
    const [accessType, setAccessType] = useState([]);
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);

    const getAllLanguagesUrl =
        "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllLanguages";
    const getAllContentStatusUrl =
        "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllContentStatus";
    const getAllContentTypeUrl =
        "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllContentType";
    const getAllGenresUrl =
        "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllGenres";
    const getAllSortsUrl =
        "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllSorts";
    const getAllAccessTypeUrl = 
        "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllAccessType";    

    const { data: languagesData, loading: languagesLoading, error: languagesError } = useFetch(getAllLanguagesUrl);
    const { data: contentStatusData, loading: contentStatusLoading, error: contentStatusError } = useFetch(getAllContentStatusUrl);
    const { data: contentTypeData, loading: contentTypeLoading, error: contentTypeError } = useFetch(getAllContentTypeUrl);
    const { data: genresData, loading: genresLoading, error: genresError } = useFetch(getAllGenresUrl);
    const { data: accessTypeData, loading: accessTypeLoading, error: accessTypeError } = useFetch(getAllAccessTypeUrl);

    useEffect(() => {
        if (languagesData) setLanguages(Object.keys(languagesData.data));
        if (contentStatusData) setContentStatus(Object.keys(contentStatusData.data));
        if (contentTypeData) setContentType(Object.keys(contentTypeData.data));
        if (genresData) setGenres(Object.keys(genresData.data));
        if (accessTypeData) setAccessType(Object.keys(accessTypeData.data));
    }, [languagesData, contentStatusData, contentTypeData, genresData, accessTypeData]);

    const [formData, setFormData] = useState({
        userId: user && user.uid,
        title: "",
        author: "",
        language: "",
        contentStatus: "",
        accessType: "",
        sorts: {
            "Editors Choice": false,
            "Hot Picks": false,
            "New Arrivals": false,
            Popular: false,
            Recommended: false,
        },
        contentType: "",
        summary: "",
        genres: {},
        coverImage: null,
    });

    console.log(formData);

    const [errors, setErrors] = useState({});
    const [resetGenres, setResetGenres] = useState(false);
    const [resetFileUpload, setResetFileUpload] = useState(false);

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
                fetch(
                    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/addNewStory",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                        body: JSON.stringify(formData),
                    }
                ).then((response) => {
                    if (!response.ok) {
                        return response.json().then((errorData) => {
                            throw new Error(errorData.message || "Something went wrong");
                        });
                    }
                    return response.json();
                }),
                {
                    pending: "Submitting your novel...",
                    success: {
                        render({ data }) {
                            console.log(data);
                            setStoryId(data.storyId);
                            setStatus(data.status);
                            setFormSubmitSuccess(true);
                            return "Your form has been successfully submitted";
                        },
                    },
                    error: {
                        render({ data }) {
                            return `Error: ${data.message}`;
                        },
                    },
                }
            );

            /* setFormData({
                      userId: user && user.uid,
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
                  });
                  setResetGenres(true);
                  setResetFileUpload(true); */
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

        if (!formData.coverImage) {
            errors.coverImage = "Cover Image is required";
        }

        return errors;
    };

    const handleDelete = (chapter) => {
        confirmAlert({
            title: "Confirm Deletion 😔",
            message: `Are you sure you want to delete ${chapter}?`,
            buttons: [
                {
                    label: "Yes, delete it",
                    onClick: () => {
                        console.log(`Deleting chapter: ${chapter}`);
                    },
                },
                {
                    label: "No, don't",
                },
            ],
        });
    };

    const handleFileChange = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                handleChange("coverImage", reader.result.toString());
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            handleChange("coverImage", null);
        }
    };

    return (
        <div className="page container-fluid">
            <ToastContainer />
            <div className="row form-holder">
                <div className="col-md-8 form-holder-left">
                    <CardWithBackground cardHeading="Novel Details :">
                        <div className="row gy-4">
                            <div className="col-md-10">
                                <FileUpload
                                    placeholder={"Upload Cover Image"}
                                    value={formData.coverImage}
                                    onChange={(file) => handleFileChange(file)}
                                    error={errors.coverImage}
                                    reset={resetFileUpload}
                                    onResetComplete={() => setResetFileUpload(false)}
                                />
                            </div>
                            <div className="col-md-2 d-flex align-items-start">
                                {/* <p>Images should not be over 2MB and of format (.jpg, .jpeg, .png)</p> */}
                                {status && (
                                    <div className={"badge ms-auto " + status.toLowerCase()}>
                                        {status}
                                    </div>
                                )}
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
                                    initialSelectedGenres={Object.keys(formData.genres).filter(
                                        (key) => formData.genres[key]
                                    )}
                                    onChange={handleGenreChange}
                                    placeholder="Select Genre/Genres"
                                    error={errors.genres}
                                    reset={resetGenres}
                                    onResetComplete={() => setResetGenres(false)}
                                />
                            </div>

                            <div className="col-12 mt-5">
                                {!formSubmitSuccess && (
                                    <BtnPrimary
                                        onClick={handleSubmit}
                                        style={{ width: "fit-content" }}
                                    >
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
                            to={
                                storyId &&
                                formSubmitSuccess &&
                                `/${user.uid}/create/novel/${storyId}/chapter`
                            }
                        >
                            <IoAdd style={{ fontSize: "2rem" }} /> Chapter
                        </BtnPrimary>
                        <ul
                            className="list-chapters"
                            style={{ position: "relative", minHeight: "30rem" }}
                        >
                            <img
                                src={notFound}
                                alt=""
                                style={{
                                    position: "absolute",
                                    top: "10%",
                                    left: "50%",
                                    transform: "translate(-100%, -50%)",
                                    scale: "0.5",
                                }}
                            />
                        </ul>
                    </CardWithHeading>
                </div>
            </div>
        </div>
    );
};

export default CreateNovel;
