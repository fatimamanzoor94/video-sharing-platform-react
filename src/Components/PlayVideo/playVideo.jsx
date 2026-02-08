import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const PlayVideo = () => {

  const {videoId} = useParams();

  const [apiData, setApiData] = useState(null)
  const [channelData, setChannelData] = useState(null)
  const [commentData, setCommentData] = useState([])

  const decodeHTML = (text) => {
    if (!text) return ""
    const txt = document.createElement("textarea")
    txt.innerHTML = text
    return txt.value
  }

  // ================= Video Data =================
  const fetchVideoData = async () => {
    try {
      const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`
      const res = await fetch(url)
      const data = await res.json()
      setApiData(data.items[0])
    } catch (error) {
      console.log("Video Error:", error)
    }
  }

  // ================= Channel + Comments =================
  const fetchOtherData = async () => {
    try {
      if (!apiData) return

      // Channel
      const channelUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
      const channelRes = await fetch(channelUrl)
      const channelJson = await channelRes.json()
      setChannelData(channelJson.items[0])

      // Comments
      const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=50&videoId=${videoId}&key=${API_KEY}`
      const commentRes = await fetch(commentUrl)
      const commentJson = await commentRes.json()
      setCommentData(commentJson.items || [])

    } catch (error) {
      console.log("Other Data Error:", error)
    }
  }

  useEffect(() => {
    fetchVideoData()
  }, [videoId])

  useEffect(() => {
    if (apiData) {
      fetchOtherData()
    }
  }, [apiData])

  return (
    <div className="play-video">

      {/* Video */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title="YouTube video"
      ></iframe>

      {/* Title */}
      <h3>{apiData?.snippet?.title || "Loading title..."}</h3>

      {/* Info */}
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "0"} Views
          &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>

        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : 0}
          </span>
          <span><img src={dislike} alt="" /></span>
          <span><img src={share} alt="" /> Share</span>
          <span><img src={save} alt="" /> Save</span>
        </div>
      </div>

      <hr />

      {/* Channel */}
      <div className="publisher">
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || user_profile}
          alt=""
        />
        <div>
          <p>{apiData?.snippet?.channelTitle}</p>
          <span>
            {channelData ? value_converter(channelData.statistics.subscriberCount) : "0"} Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      {/* Description */}
      <div className="video-description">
        <p>{apiData?.snippet?.description?.slice(0, 250)}</p>
        <hr />

        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : 0} Comments
        </h4>

        {/* Comments */}
        {commentData.length > 0 ? (
          commentData.map((item, index) => (
            <div key={index} className="comment">
              <img
  src={
    item.snippet.topLevelComment.snippet.authorProfileImageUrl
      ?.replace("http://", "https://") || user_profile
  }
  onError={(e) => {
    e.target.src = user_profile
  }}
  alt=""
/>

              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}
                  <span>
                    {moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}
                  </span>
                </h3>
                <p>
                  {decodeHTML(
                    item.snippet.topLevelComment.snippet.textOriginal ||
                    item.snippet.topLevelComment.snippet.textDisplay
                  )}
                </p>

                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>
                    {value_converter(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </div>
  )
}

export default PlayVideo
