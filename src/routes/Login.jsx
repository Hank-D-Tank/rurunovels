import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import video from "../assets/login.mp4";
import audioFile from "../assets/audio.mp3";
import logo from "../assets/logo.png";
import BtnPrimary from "../components/buttons/BtnPrimary";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaQuoteLeft, FaRegCopyright } from "react-icons/fa";
import { CiVolumeHigh, CiVolumeMute } from "react-icons/ci";
import { auth, googleAuthProvider, signInWithPopup } from '../configs/firebase';
import { setPersistence, browserLocalPersistence } from "firebase/auth"; 
import UserIcon from "../components/utilities/UserIcon"; 

const Login = () => {
    const [isMuted, setIsMuted] = useState(true);
    const [userEmail, setUserEmail] = useState(null);
    const audioRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = true;
            audioRef.current.play().catch(error => {
                console.log('Audio play failed:', error);
            });
        }
    }, []);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.muted = false;
                audioRef.current.play().catch(error => {
                    console.log('Audio play failed:', error);
                });
            } else {
                audioRef.current.muted = true;
            }
            setIsMuted(!isMuted);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, googleAuthProvider);
            const user = result.user;
            if (user) {
                console.log('User signed in:', user);
                if (user.emailVerified) {
                    const userDetails = {
                        displayName: user.displayName,
                        uid: user.uid,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        photoURL: user.photoURL,
                        accessToken: user.stsTokenManager.accessToken,
                        refreshToken: user.stsTokenManager.refreshToken,
                        expirationTime: user.stsTokenManager.expirationTime
                    };

                    const apiData = {
                        uid: userDetails.uid,
                        token: userDetails.accessToken,
                        refreshToken: userDetails.refreshToken,
                        expiration: userDetails.expirationTime
                    };

                    const response = await fetch('https://us-central1-cb-story-app-27012024.cloudfunctions.net/saveRefreshToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(apiData)
                    });

                    console.log(response);

                    if (response.ok) {
                        localStorage.setItem('user', JSON.stringify(userDetails));
                        setUserEmail(user.email);
                        navigate('/');
                    } else {
                        console.error('Failed to save refresh token:', response.statusText);
                    }
                } else {
                    console.log('Email not verified.');
                }
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="container-fluid">
            <div className="main-container login-main-container" style={{ position: "relative", minHeight: "100vh", width: "100vw" }}>
                <video src={video} autoPlay muted loop style={{ position: "absolute", inset: "0", width: "100vw", filter: "blur(1.5rem)" }}></video>

                <audio ref={audioRef} src={audioFile} autoPlay loop />

                <div className="login-form-container">
                    <div className="row gx-0 p-0">
                        <div className="col-md-6 login-video-player p-0">
                            <video src={video} autoPlay muted loop></video>
                        </div>
                        <div className="col-md-6 login-video-player p-0">
                            <video src={video} autoPlay muted loop></video>
                            <div className="login-form p-5">
                                <div className="login-form-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div className="logo">
                                        <img src={logo} alt="" />
                                        <div className="name">Ruru Novels</div>
                                    </div>
                                    <div className="login-audio-controller" onClick={toggleAudio} style={{ cursor: "pointer" }}>
                                        {isMuted ? <> <span>wanna chill?</span> <CiVolumeMute /></> : <><span>done chilling?</span> <CiVolumeHigh /></>}
                                    </div>
                                </div>
                                <div className="bar"></div>
                                <div className="login-form-header">
                                    <h3>Sign In To Ruru Novels.</h3>
                                    
                                <span>Don't have an account? <small>Create One</small></span>
                                </div>
                                <div className="bar"></div>

                                <div className="login-form-quote">
                                    <FaQuoteLeft style={{ opacity: "0.3" }} /><p>Reading novels makes me wise; reading comics makes me a superhero!</p>
                                </div>

                                <div className="login-form-buttons">
                                    <BtnPrimary className="btn-white" onClick={signInWithGoogle}>
                                        {" "}
                                        Sign In Using Google <FcGoogle />{" "} &nbsp;
                                    </BtnPrimary>

                                    <BtnPrimary className="btn-red" style={{pointerEvents: "none", opacity: 0.6}}>
                                        {" "}
                                        Sign In Using Facebook <FaFacebookSquare style={{ color: '#fff' }} />{" "}
                                    </BtnPrimary>
                                </div>

                                <div className="login-form-footer"> <FaRegCopyright style={{ opacity: "0.5" }} /> Copyright <span>Ruru Novels</span> 2024 </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
