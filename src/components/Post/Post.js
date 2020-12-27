import React, { Component } from "react";
import { PostData } from "../../DummyData/Post";
import Navbar from "../Navbar/Navbar";
import Title from "../Title/Title";
import "./Post.css";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./constants";
import Footer from "../Footer/Footer";
import { SocialButton, StyledLogo } from "../../StyledComponents/Buttons";
import {
  SectionHeader,
  SectionUnderline,
} from "../../StyledComponents/Headers";
import {
  faFacebookF,
  faRedditAlien,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Content from "../Content/Content";
import UserManager, { API_DEV } from "../../Utils";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faSolidBookmark } from "@fortawesome/free-solid-svg-icons";
import { WhatsappShareButton, FacebookShareButton } from "react-share";

const SharePost = (props) => {
  const post_url = `${API_DEV}post/${props.postId}`;
  return (
    <>
      <SectionHeader>
        Share the post
        <SectionUnderline />
      </SectionHeader>
      <div className="SharePostContainer">
        <SocialButton
          width="28%"
          height="80%"
          background="#3E5B98"
          as="a"
          href="/login"
        >
          <FontAwesomeIcon
            icon={faFacebookF}
            size="2x"
            style={{
              color: "white",
            }}
          />
        </SocialButton>
        <SocialButton
          width="28%"
          height="80%"
          background="#4DA7DE"
          as="a"
          href="/login"
        >
          <FontAwesomeIcon
            icon={faTwitter}
            size="2x"
            style={{
              color: "white",
            }}
          />
        </SocialButton>
        <SocialButton
          width="28%"
          height="80%"
          background="#E74A1E"
          as="a"
          href="/login"
        >
          <FontAwesomeIcon
            icon={faRedditAlien}
            size="2x"
            style={{
              color: "white",
            }}
          />
        </SocialButton>
      </div>
    </>
  );
};

class Post extends Component {
  constructor() {
    super();
    this.state = {
      liked: false,
      likesCount: null,
      PostData: null,
      loading: true,
      bookmarked: false,
      bookmarkLoading: false,
      post_id: "",
    };

    this.myRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.props.match);
    const post_id = this.props.match.params.post_id;
    fetch(`${API_DEV}post/${post_id}`)
      .then((res) => {
        return res.json();
      })
      .then(async (data) => {
        const is_bookmarked = await this.checkBookmarked(
          post_id,
          UserManager.getUserId()
        );
        const postData = {
          Title: data.post.title,
          Author: data.post.user.name,
          Likes: data.post.likes,
          AuthorDescription: "Someome",
          PostContent: data.post.content,
          AuthorId: data.post.user_id,
          post_id,
        };
        this.setState({
          PostData: postData,
          likesCount: data.post.likes,
          bookmarked: is_bookmarked,
          loading: false,
          post_id: post_id,
        });
        console.log(data);
      })
      .catch((err) => {
        this.props.history.replace("/not_found");
      });
  }

  checkBookmarked = (post_id, user_id) => {
    if (!UserManager.isLoggedin()) {
      return false;
    }
    return fetch(`${API_DEV}bookmark/isBookmark/${post_id}&${user_id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + UserManager.getToken(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return data.is_bookmarked;
      });
  };

  executeScroll = () => {
    this.myRef.current.scrollIntoView();
  };

  addBookmark = () => {
    if (UserManager.isLoggedin()) {
      this.setState({
        bookmarkLoading: true,
      });
      const data = {
        post_id: this.state.PostData.post_id,
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
            this.setState({
              bookmarked: true,
              bookmarkLoading: false,
            });
          } else {
            this.setState({
              bookmarkLoading: false,
            });
          }
        })
        .catch((err) => {
          this.setState({
            bookmarkLoading: false,
          });
        });
    } else {
      this.props.history.push("/login");
    }
  };

  removeBookmark = () => {
    const user_id = UserManager.getUserId();

    fetch(
      `${API_DEV}bookmark/delete/${this.state.PostData.post_id}&${user_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + UserManager.getToken(),
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);

        if (!data.error) {
          this.setState({
            bookmarked: false,
            bookmarkLoading: false,
          });
        } else {
          this.setState({
            bookmarkLoading: false,
          });
        }
      })
      .catch((_) => {
        this.setState({
          bookmarkLoading: false,
        });
      });
  };

  render() {
    if (this.state.loading) {
      return <div>loading</div>;
    }
    return (
      <div>
        <Navbar />
        <Title
          addButton={true}
          red_button="Read On"
          white_button="Read Later"
          title={this.state.PostData.Title}
          author={this.state.PostData.Author}
          onPrimaryClick={this.executeScroll}
          onSecondaryClick={
            this.state.bookmarked ? this.removeBookmark : this.addBookmark
          }
          white_button={this.state.bookmarked ? "Bookmarked" : "Bookmark"}
          secondaryIcon={this.state.bookmarked ? faSolidBookmark : faBookmark}
          bookmarkLoading={this.state.bookmarkLoading}
        />
        <Content title="ENJOY YOUR READ !" refProp={this.myRef}>
          <EditorJs
            tools={EDITOR_JS_TOOLS}
            data={this.state.PostData.PostContent}
            readOnly={true}
          />
          <SectionHeader marginTop="0px">
            Like the post
            <SectionUnderline />
          </SectionHeader>
          <div className="LikePostContainer">
            <StyledLogo
              isLiked={this.state.liked}
              onClick={() => {
                //First change state
                this.setState((prevState) => {
                  return {
                    liked: true,
                    likesCount: prevState.likesCount + 1,
                  };
                });

                //api call to update likes in the backend
                fetch(`${API_DEV}post/like/${this.state.post_id}`, {
                  method: "POST",
                }).catch((err) => {
                  // Notify failed error
                  this.setState((prevState) => {
                    return {
                      liked: false,
                      likesCount: prevState.likesCount - 1,
                    };
                  });
                });
              }}
              disabled={this.state.liked}
            />
            <span className="LikesText">
              {this.state.likesCount}{" "}
              {this.state.likesCount === 1 ? "Like" : "Likes"}
            </span>
          </div>
          <SharePost postId={this.state.post_id} />
          <SectionHeader>
            About the author
            <SectionUnderline />
          </SectionHeader>
          <div className="AboutAuthorContainer">
            <div className="AboutAuthorImageContainer">
              <div className="AboutAuthorImage"></div>
            </div>
            <div className="AboutAuthorDescription">
              <div className="AboutAuthorName">
                <p
                  style={{
                    marginBottom: "4px",
                  }}
                >
                  {this.state.PostData.Author}
                </p>
              </div>
              <p className="AboutAuthorDescriptionText">
                {this.state.PostData.AuthorDescription}
              </p>
            </div>
          </div>
        </Content>

        <Footer />
      </div>
    );
  }
}

export default Post;
