import React, { useState } from "react";
import "./Article.css";
import { SectionUnderline } from "../../StyledComponents/Headers";
import { PostContainer } from "../../StyledComponents/Container";
import UserManager, { API_DEV } from "../../Utils";
import { PrimaryButton, SecondaryButton } from "../../StyledComponents/Buttons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as faSolidBookmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const ArticleHeader = (props) => {
  const { blog, link } = props;
  return (
    <div className="PostHeader">
      <a href={link} className="PostLink">
        {blog.title}
      </a>
      <p
        style={{
          color: "#aaaaaa",
          fontSize: "0.9rem",
        }}
      >
        By{" "}
        <a href="#" className="AuthorLink">
          {blog.author}
        </a>
      </p>
    </div>
  );
};

const Article = (props) => {
  const { blog } = props;
  const [bookMarkLoading, setBookMarkLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const addBookmark = (post_id) => {
    if (UserManager.isLoggedin()) {
      const data = {
        post_id: post_id,
        user_id: UserManager.getUserId(),
      };

      fetch(`${API_DEV}bookmark/add`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + UserManager.getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          if (!data.error) {
            setBookmarked(true);
            setBookMarkLoading(false);
          }
        });
    } else {
      props.routeProps.history.push("/login");
    }
  };

  return (
    <div>
      <div className="ArticleContainer">
        <div className="DateContainer">
          <div className="DatePointContainer">
            <div className="PointContainer"></div>
            <span className="date-day">{blog.day}</span>
            <span className="date-month">{blog.month}</span>
          </div>
        </div>

        <PostContainer top={props.top}>
          <span className="DateContainerMob">
            {blog.month} {blog.day}, {blog.year}
          </span>
          {UserManager.isLoggedin() &&
          blog.authorId == UserManager.getUserId() ? (
            <ArticleHeader blog={blog} link={`new-story/${blog.post_id}`} />
          ) : (
            <ArticleHeader blog={blog} link={`post/${blog.post_id}`} />
          )}

          <div className="PostContent">
            <p>{blog.summary}</p>
          </div>
          <div className="ArticleButtonsContainer">
            <SecondaryButton
              as="a"
              href={
                UserManager.isLoggedin() &&
                blog.authorId == UserManager.getUserId()
                  ? `new-story/${blog.post_id}`
                  : `post/${blog.post_id}`
              }
            >
              Read On
            </SecondaryButton>
            <PrimaryButton
              border
              onClick={() => {
                setBookMarkLoading(true);
                if (props.secondButtonClick) {
                  props.secondButtonClick(blog.post_id);
                } else {
                  addBookmark(blog.post_id);
                }
              }}
            >
              {bookMarkLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : bookmarked ? (
                <>
                  <FontAwesomeIcon icon={faSolidBookmark} />
                  Bookmarked
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faBookmark} />
                  Bookmark
                </>
              )}
            </PrimaryButton>
          </div>
        </PostContainer>
      </div>

      <SectionUnderline />
    </div>
  );
};

export default Article;
