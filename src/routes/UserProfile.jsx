import React, { useEffect, useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import CardWithBackground from '../components/cards/CardWithBackground';
import BtnPrimary from '../components/buttons/BtnPrimary';
import { ImBookmark } from 'react-icons/im';
import { IoAddSharp, IoCloudUploadSharp } from 'react-icons/io5';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usePostFetch from '../components/hooks/usePostFetch';
import SectionNoChapterCard from '../components/cards/SectionNoChapterCard';
import Modal from '../components/modals/Modal';
import FileUpload from '../components/form/FileUpload';
import { useNavigate, useParams } from 'react-router-dom';
import noNovels from '../assets/no-novels.png';

const UserProfile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user.email;
    const seed = email || 'default-image-for-ruru-novels';
    const avatarConfig = {
        ...genConfig(seed),
        sex: 'man',
        hairStyle: "none",
    };

    const navigate = useNavigate();
    const { userId } = useParams();
    const url = "https://us-central1-cb-story-app-27012024.cloudfunctions.net/getAuthorStories";
    const {
        data: novelData,
        loading: novelLoading,
        error: novelError,
    } = usePostFetch(url, user.accessToken, { userId }, []);
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
            await toast.promise(
                fetch(
                    "https://us-central1-cb-story-app-27012024.cloudfunctions.net/deleteStory",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                        body: JSON.stringify({ userId, storyId: novelId }),
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
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                        body: JSON.stringify({ userId, storyId: selectedNovelId, coverImage: selectedFile }),
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
                            if (data.success) {
                                setNovels(prevNovels => ({
                                    ...prevNovels,
                                    [selectedNovelId]: {
                                        ...prevNovels[selectedNovelId],
                                        Image: selectedFile,
                                    }
                                }));
                            }
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

    const editDropDown = (novelId, novelTitle) => [
        {
            label: "Upload Cover Image",
            onClick: () => handleUploadCoverImage(novelId),
        },
        { label: "Add Chapters", to: `/${userId}/create/novel/${novelId}/chapter` },
        { label: "Edit Novel", to: `/${userId}/edit/novel/${novelId}/` },
        {
            label: "Delete Novel",
            onClick: () => handleDeleteNovel(novelId, novelTitle),
        },
    ];

    return (
        <div className="page">
            <ToastContainer />
            {!novelLoading && novelData && <div className="user-profile-header">
                <div className="user-profile-bg"></div>
                <div className="user-info">
                    <div className="user-profile-image">
                        <Avatar style={{ width: '15rem', height: '15rem' }} {...avatarConfig} />
                    </div>
                    <CardWithBackground style={{ display: "flex", flexDirection: "column", backdropFilter: "blur(2rem)", marginBlock: 0 }}>
                        <h2>{user.displayName}</h2>
                        <span style={{ fontStyle: "italic", opacity: "0.7" }}>I fight to lose</span>
                        <div className="profile-footer">
                            <BtnPrimary className='btn-white d-flex align-items-center justify-content-center' to={`/bookshelf/filter?contentType=all`}>
                                <ImBookmark style={{ fontSize: "2rem", marginRight: "0.5rem" }} /> Bookmarks
                            </BtnPrimary>
                            <BtnPrimary className='btn-red d-flex align-items-center justify-content-center ms-5' to={`/${userId}/create/novel/`}>
                                <IoAddSharp style={{ fontSize: "2rem", marginRight: "0.5rem" }} /> Write A Novel
                            </BtnPrimary>
                        </div>
                    </CardWithBackground>
                </div>
            </div>}
            <div className="user-profile-novels row">
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
                    Object.entries(novels).length > 0 ? (
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
                    ) : (
                        <div className='user-no-novels'>
                            <img src={noNovels} alt=""/>
                        </div>
                    )
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

export default UserProfile;
