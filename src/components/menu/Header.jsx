import React, { useState } from "react";
import Search from "../utilities/Search";
import SidebarCard from "../cards/SidebarCard";
import UserIcon from "../utilities/UserIcon";
import { Link } from "react-router-dom";

const Header = ({ children, allStoryData, email }) => {
  const [searchInput, setSearchInput] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));
  const searchDataArr = allStoryData?.data
    .filter((item) =>
      item.StoryTitle.toLowerCase().includes(searchInput.toLowerCase())
    )
    .map((item, index) => {
      const genres = Object.keys(item.Genres).filter(
        (genre) => item.Genres[genre]
      );

      return (
        <SidebarCard
          key={index}
          novelId={item.StoryId}
          novelCoverImg={item.StoryImage}
          novelTitle={item.StoryTitle}
          novelRating={item.Ratings + "/10.0"}
          novelRatingPercent={parseFloat(item.Ratings) * 10 + "%"}
          novelVotes={item.Votes}
          novelGenre={genres}
        />
      );
    }) || [];

  return (
    <div className="header">
      {children}
      <Search
        className="mx-auto"
        inputValue={searchInput}
        setInputValue={setSearchInput}
        dataArr={searchDataArr}
      />
      <Link to={user ? `/profile/u/${user.uid}` : "/login"}>
        <UserIcon email={email} />
      </Link>
    </div>
  );
};

export default Header;
