import React, { useState } from 'react'
import BtnAction from './components/buttons/BtnAction'

/* 
import SingleBigCard from './components/cards/SingleBigCard'
import SectionWithChapterCard from './components/cards/SectionWithChapterCard';
import SectionNoChapterCard from './components/cards/SectionNoChapterCard';
import SidebarCard from './components/cards/SidebarCard';
import SingleDetailCard from './components/cards/SingleDetailCard';
import CardWithHeading from './components/cards/CardWithHeading';
import CardWithBackground from './components/cards/CardWithBackground';
import CardRating from './components/utilities/CardRating';
import CardGenre from './components/utilities/CardGenre';
import CardAction from './components/utilities/CardAction';
import Autocomplete from './components/form/Autocomplete';
import Input from './components/form/Input';
import Modal from './components/modals/Modal'; */

import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/menu/Sidebar';
import MainContainer from './components/utilities/MainContainer';
import Header from './components/menu/Header';
import { PiArrowLineLeftDuotone, PiArrowLineRightDuotone } from 'react-icons/pi';
import { IoSettings } from 'react-icons/io5';
import useFetch from './components/hooks/useFetch';
import UserIcon from './components/utilities/UserIcon';
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from 'react-icons/bs';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  }
  const searchApiUrl ="https://us-central1-cb-story-app-27012024.cloudfunctions.net/filterStoryByTitle?title="
  const {data: searchData, loading: searchLoading, error: searchError} = useFetch(searchApiUrl);

  return (
    <>
      <Sidebar isOpen={sidebarOpen}/>
      <MainContainer style={sidebarOpen ? {width: "calc(100% - 24rem)"} : {width: "calc(100% - 8rem)"}}>
        <Header allStoryData = {searchData} email={user && user.email}>
          <BtnAction className="btn-grey" style={{padding: "0.5rem 1rem"}} onClick={sidebarToggle}>{sidebarOpen ? <BsLayoutSidebarInsetReverse  style={{fontSize: "2rem"}}/> : <BsLayoutSidebarInset  style={{fontSize: "2rem"}}/>}</BtnAction>
        </Header>
        <Outlet/>
      </MainContainer>
    </>
  )
}


export default App