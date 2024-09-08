import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../components/form/Input";
import { FaPenNib, FaLink } from "react-icons/fa";
import FileUpload from "../components/form/FileUpload";
import BtnPrimary from "../components/buttons/BtnPrimary";
import { MdDelete, MdEdit, MdNumbers } from "react-icons/md";
import CardWithBackground from "../components/cards/CardWithBackground";
import CardWithHeading from "../components/cards/CardWithHeading";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { IoAdd } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import StorySlate from "../components/utilities/StorySlate";
import mammoth from "mammoth";
import InputDateTime from "../components/form/InputDateTime";
import { SlCalender } from "react-icons/sl";
import notFound from "../assets/not-found.svg";

const CreateChapter = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { storyId } = useParams();
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log(chapters)

    const chapterList = async () => {
        const url = 'https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAllChapters';
        const accessToken = user.accessToken;
        const requestData = {
            userId: user.uid,
            storyId: storyId
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            console.log('Response Data:', responseData);
            if(responseData.chapters){
                setChapters(responseData.chapters);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    useEffect(() => {
        chapterList();
    }, []);

    const slateRef = useRef(null);
    const initialFormData = {
        userId: user && user.uid,
        storyId: storyId,
        title: "",
        url: "",
        chapterNo: "",
        scheduledOn: "",
        chapterContentDoc: null,
        content: null
    };
    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});
    const [resetFileUpload, setResetFileUpload] = useState(false);

    const slugify = (text) => {
        return text
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    };

    const handleChange = (field, value) => {
        let newFormData = { ...formData, [field]: value };
        if (field === "title") {
            newFormData.url = slugify(value);
        }
        setFormData(newFormData);
    };

    const handleDateTimeChange = (field, value) => {
        const date = new Date(value);
        const milliseconds = date.getTime();
        setFormData({ ...formData, [field]: milliseconds });
    };

    const handleSubmit = () => {
        const plainText = slateRef.current ? slateRef.current.getText() : '';
        const validationErrors = validateFormData(plainText);
        if (Object.keys(validationErrors).length === 0) {
            confirmAlert({
                title: "Confirm Submission 😀",
                message: "Are you sure you want to submit the form with the provided information?",
                buttons: [
                    {
                        label: "Yes",
                        onClick: handleFormSubmit,
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
            const plainText = slateRef.current ? slateRef.current.getText() : '';

            const response = await toast.promise(
                fetch('https://us-central1-cb-story-app-27012024.cloudfunctions.net/addNewChapter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`,
                    },
                    body: JSON.stringify({ ...formData, plainText }),
                }).then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message || 'Something went wrong');
                        });
                    }
                    return response.json();
                }),
                {
                    pending: 'Submitting your chapter...',
                    success: {
                        render({ data }) {
                            setFormSubmitSuccess(true);
                            chapterList(); // Refetch chapters
                            return 'Your form has been successfully submitted';
                        }
                    },
                    error: {
                        render({ data }) {
                            return `Error: ${data.message}`;
                        }
                    }
                }
            );
            setFormData({
                userId: user && user.uid,
                storyId: storyId,
                title: "",
                url: "",
                chapterNo: "",
                scheduledOn: "",
                chapterContentDoc: null,
                content: null
            });
            setResetFileUpload(true);
            setFormSubmitSuccess(false);
            setErrors({});
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };


    const validateFormData = (plainText) => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = "Title is required";
        }

        if (!formData.url.trim()) {
            errors.url = "Chapter URL is required";
        }

        if (!formData.chapterNo.trim()) {
            errors.chapterNo = "Chapter number is required";
        }

        if (!formData.content || !formData.content.trim() || formData.content === "<p><br></p>" || formData.content === null) {
            errors.content = "Chapter content is required";
        }

        if (formData.scheduledOn && formData.scheduledOn < Date.now()) {
            errors.scheduledOn = "Scheduled date and time cannot be in the past";
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
    const handleFileChange = async (file) => {
        const reader = new FileReader();
        reader.onloadend = async (e) => {
            if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                try {
                    const result = await mammoth.convertToHtml({ arrayBuffer: e.target.result });
                    handleChange("content", result.value);
                } catch (err) {
                    console.log(err);
                }
            } else if (file.type === "text/plain") {
                handleChange("content", e.target.result);
            }
        };

        if (file.type === "text/plain") {
            reader.readAsText(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className="page container-fluid">
            <ToastContainer />
            <div className="row form-holder">
                <div className="col-md-8 form-holder-left">
                    <CardWithBackground cardHeading="Chapter Details :">
                        <div className="row gy-4">
                            <div className="col-md-6">
                                <Input
                                    placeholder={"Chapter Title"}
                                    icon={<FaPenNib />}
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    animate={false}
                                    error={errors.title}
                                />
                            </div>
                            <div className="col-md-6">
                                <Input
                                    placeholder={"Chapter Url"}
                                    icon={<FaLink />}
                                    value={formData.url}
                                    onChange={(e) => handleChange("url", e.target.value)}
                                    animate={false}
                                    error={errors.url}
                                    disabled
                                />
                            </div>
                            <div className="col-md-6">
                                <Input
                                    placeholder={"Chapter No."}
                                    icon={<MdNumbers />}
                                    value={formData.chapterNo}
                                    onChange={(e) => handleChange("chapterNo", e.target.value)}
                                    animate={false}
                                    error={errors.chapterNo}
                                />
                            </div>
                            <div className="col-md-6">
                                <InputDateTime
                                    placeholder={"Schedule Time (if any)"}
                                    icon={<SlCalender />}
                                    value={formData.scheduledOn ? new Date(formData.scheduledOn).toISOString().substring(0, 16) : ""}
                                    onChange={(e) => handleDateTimeChange("scheduledOn", e.target.value)}
                                    animate={false}
                                    error={errors.scheduledOn}
                                />
                            </div>
                            <div className="col-md-6">
                                <FileUpload
                                    placeholder={"Upload Chapter (.docx)"}
                                    value={formData.chapterContentDoc}
                                    onChange={handleFileChange}
                                    error={errors.chapterContentDoc}
                                    reset={resetFileUpload}
                                    onResetComplete={() => setResetFileUpload(false)}
                                />
                            </div>
                            <div className="col-12 mt-5">
                                {!formSubmitSuccess && <BtnPrimary
                                    onClick={handleSubmit}
                                    style={{ width: "fit-content" }}
                                >
                                    Submit
                                </BtnPrimary>}
                            </div>
                        </div>
                    </CardWithBackground>
                    <div className="col-12 mt-4">
                        <StorySlate
                            ref={slateRef}
                            value={formData.content}
                            onChange={(content) => handleChange("content", content)}
                        />
                    </div>
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
                            to={(storyId && formSubmitSuccess) && `/${user.uid}/create/novel/${storyId}/chapter`}
                        >
                            <IoAdd style={{ fontSize: "2rem" }} /> Chapter
                        </BtnPrimary>
                        {loading ? (
                            <div className="loader" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}></div>
                        ) : (
                            <ul className="list-chapters" style={{ position: "relative", minHeight: "30rem" }}>
                                {Object.keys(chapters).length > 0 ? (
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
                        )}

                    </CardWithHeading>
                </div>
            </div>
        </div>
    );
};

export default CreateChapter;


