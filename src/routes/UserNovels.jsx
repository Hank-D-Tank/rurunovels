import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePostFetch from "../components/hooks/usePostFetch";
import SectionNoChapterCard from "../components/cards/SectionNoChapterCard";
import SectionHeading from "../components/utilities/SectionHeading";
import BtnPrimary from "../components/buttons/BtnPrimary";
import { IoAdd, IoCloudUploadSharp } from "react-icons/io5";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../components/modals/Modal";
import FileUpload from "../components/form/FileUpload";

const UserNovels = () => {
    const navigate = useNavigate();
    const url =
        "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAuthorStories";
    const userData = JSON.parse(localStorage.getItem("user"));
    const { user } = useParams();
    const {
        data: novelData,
        loading: novelLoading,
        error: novelError,
    } = usePostFetch(url, userData.accessToken, { userId: user }, []);
    const [novels, setNovels] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedNovelId, setSelectedNovelId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [resetFileUpload, setResetFileUpload] = useState(false);

    useEffect(() => {
        if (novelData) {
            if (Object.keys(novelData.stories).length > 0) {
                setNovels(novelData.stories);
            }
        }
    }, [novelData]);



    const handleUploadCoverImage = (novelId) => {
        confirmAlert({
            title: "Confirm Cover Image Update",
            message: "Are you sure you want to update the cover image?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        setSelectedNovelId(novelId);
                        setShowModal(true);
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const handleDeleteNovel = (deleteNovelId, novelTitle) => {
        confirmAlert({
            title: "Confirm Deletion 😔",
            message: `Are you sure you want to delete ${novelTitle}?`,
            buttons: [
                {
                    label: "Yes, delete it",
                    onClick: () => {
                        deleteNovel(deleteNovelId);
                    },
                },
                {
                    label: "No, don't",
                },
            ],
        });
    };

    const deleteNovel = async (novelId) => {
        try {
            const response = await toast.promise(
                fetch(
                    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/deleteStory",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userData.accessToken}`,
                        },
                        body: JSON.stringify({ userId: user, storyId: novelId }),
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
                    pending: "Deleting your novel...",
                    success: {
                        render({ data }) {
                            const filteredNovels = Object.fromEntries(
                                Object.entries(novels).filter(([key]) => key !== novelId)
                            );
                            setNovels(filteredNovels);
                            return "Your novel has been successfully deleted.";
                        },
                    },
                    error: {
                        render({ data }) {
                            return `Error: ${data.message}`;
                        },
                    },
                }
            );
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleFileChange = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                setSelectedFile(reader.result.toString());
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
        }
    };


    const handleUploadCoverImageSubmit = async () => {
        if (!selectedFile) {
            toast.error("Please select a file before submitting.");
            return;
        }

        try {
            await toast.promise(
                fetch(
                    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/updateCoverImage",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userData.accessToken}`,
                        },
                        body: JSON.stringify({ userId: user, storyId: selectedNovelId, coverImage: selectedFile }),
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
                    pending: "Submitting your cover image...",
                    success: {
                        render({ data }) {
                            if(data.success){
                                setNovels(prevNovels => ({
                                    ...prevNovels,
                                    [selectedNovelId]: {
                                        ...prevNovels[selectedNovelId],
                                       Image: selectedFile,
                                    }
                                }));       
                            }

                            console.log(selectedFile)
                            return "Your novel cover has been successfully updated.";
                        },
                    },
                    error: "Failed to update cover image.",

                }
            );
            setShowModal(false);
            setSelectedFile(null);
            setResetFileUpload(true);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    console.log(Object.entries(novels))
    

    const editDropDown = (novelId, novelTitle) => [
        {
            label: "Upload Cover Image",
            onClick: () => handleUploadCoverImage(novelId),
        },
        { label: "Add Chapters", to: `/${user}/create/novel/${novelId}/chapter` },
        { label: "Edit Novel", to: `/${user}/edit/novel/${novelId}/` },
        {
            label: "Delete Novel",
            onClick: () => handleDeleteNovel(novelId, novelTitle),
        },
    ];

    return (
        <div className="page">
            <ToastContainer />
            <div className="row mt-2">
                <SectionHeading heading={"Your Writings"}></SectionHeading>
                {!novelLoading && novelData && (
                    <div className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-5">
                        <div className="single-card single-card-no-chapter add-new-novel card-with-heading-background p-0 m-0">
                            <BtnPrimary
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "0.8rem 1.5rem",
                                    fontSize: "1.3rem",
                                }}
                                to={`/${user}/create/novel/`}
                            >
                                <IoAdd style={{ fontSize: "2rem" }} /> New Novel
                            </BtnPrimary>
                        </div>
                    </div>
                )}
                {novelLoading && !novelData ? (
                    <div
                        className="loader"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    ></div>
                ) : (
                    Object.entries(novels).map(([key, value]) => (
                        <div
                            key={key}
                            className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-5"
                        >
                            <SectionNoChapterCard
                                novelId={key}
                                novelCoverImg={value.Image}
                                novelTitle={value.Title}
                                novelSynopsis={value.Summary}
                                novelTags={[]}
                                edit={true}
                                editDropDown={editDropDown(key, value.Title)}
                            />
                        </div>
                    ))
                )}
            </div>

            <Modal
                show={showModal}
                modalTitle="Upload New Cover Image"
                modalAction="Change Cover"
                modalActionIcon={<IoCloudUploadSharp style={{ marginLeft: "0.5rem", fontSize: "2rem" }} />}
                modalActionEvent={handleUploadCoverImageSubmit}
                onClose={() => setShowModal(false)}
            >
                <FileUpload
                    placeholder="Upload an image"
                    value={selectedFile}
                    onChange={handleFileChange}
                    reset={resetFileUpload}
                    onResetComplete={() => setResetFileUpload(false)}
                />
            </Modal>
        </div>
    );
};

export default UserNovels;
