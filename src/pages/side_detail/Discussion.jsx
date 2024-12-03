import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Heart, HeartFill, Trash } from "react-bootstrap-icons";

const API_BASE_URL = "http://localhost:8000/api/discussion";
const SOCKET_URL = "http://localhost:8000";

function Discussion({ roomId }) {
  const [currentUser] = useState("사용자");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  
  const socket = React.useRef(null);

  useEffect(() => {
    // REST API로 기존 채팅 히스토리 불러오기
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/comments/${roomId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchComments();

    // WebSocket 연결
    socket.current = io(SOCKET_URL, { query: { room: roomId } });

    // WebSocket 메시지 수신
    socket.current.on("message", (newComment) => {
      setComments((prev) => [...prev, newComment]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [roomId]);

  const addComment = () => {
    if (newComment.trim() === "") return;
    const comment = { author: currentUser, content: newComment };
    socket.current.emit("message", comment); // WebSocket으로 전송
    setNewComment("");
  };

  const toggleLike = async (commentId) => {
    try {
      await axios.patch(`${API_BASE_URL}/comments/${commentId}`);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  const toggleLike = async (commentId) => {
    try {
      await axios.patch(`${API_BASE_URL}/comments/${commentId}`);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                isLiked: !c.isLiked,
                likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="h5 mb-0">Room: {roomId}</h3>
      </div>
      <div className="card-body">
        {comments.map((comment) => (
          <div key={comment.id} className="d-flex gap-3 mb-3 p-3 bg-light rounded">
            <div className="bg-dark rounded" style={{ width: "48px", height: "48px", flexShrink: 0 }} />
            <div className="flex-grow-1 d-flex justify-content-between align-items-start">
              <div>{comment.content}</div>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-link text-danger p-0"
                  onClick={() => toggleLike(comment.id)}
                >
                  {comment.isLiked ? <HeartFill /> : <Heart />}
                  <span className="ms-1">{comment.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Type your message"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment} className="btn btn-primary mt-2">Send</button>
        </div>
      </div>
    </div>
  );
}

export default Discussion;

// import React, { useEffect, useState } from 'react';
// import { Heart, HeartFill, Trash } from 'react-bootstrap-icons';

// function Discussion() {
//   const [currentUser] = useState('사용자'); // 현재 로그인한 사용자를 나타냅니다. 실제 앱에서는 인증 시스템과 연동해야 합니다.
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const API_BASE_URL = 'http://localhost:8000/api/discussion'; // FastAPI 서버 주소

//   // 서버에서 댓글 데이터를 가져오는 함수
//   const fetchComments = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/comments`);
//       if (response.ok) {
//         const data = await response.json();
//         setComments(data);
//       } else {
//         console.error('Failed to fetch comments');
//       }
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//   };

//   // 댓글 추가
//   const addComment = async () => {
//     if (!newComment.trim()) return;
//     const newCommentObj = {
//       section: '새 댓글',
//       author: currentUser,
//       content: newComment,
//       likes: 0,
//       isLiked: false,
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/comments`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newCommentObj),
//       });
//       if (response.ok) {
//         const addedComment = await response.json();
//         setComments((prev) => [...prev, addedComment]);
//         setNewComment('');
//       } else {
//         console.error('Failed to add comment');
//       }
//     } catch (error) {
//       console.error('Error adding comment:', error);
//     }
//   };

//   // 좋아요 토글
//   const toggleLike = async (commentId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
//         method: 'PATCH',
//       });
//       if (response.ok) {
//         setComments((prev) =>
//           prev.map((comment) =>
//             comment.id === commentId
//               ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
//               : comment
//           )
//         );
//       } else {
//         console.error('Failed to toggle like');
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//     }
//   };

//   // 댓글 삭제
//   const deleteComment = async (commentId) => {
//     if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
//           method: 'DELETE',
//         });
//         if (response.ok) {
//           setComments((prev) => prev.filter((comment) => comment.id !== commentId));
//         } else {
//           console.error('Failed to delete comment');
//         }
//       } catch (error) {
//         console.error('Error deleting comment:', error);
//       }
//     }
//   };

//   // 컴포넌트가 마운트될 때 서버에서 댓글 데이터를 가져옵니다.
//   useEffect(() => {
//     fetchComments();
//   }, []);

//   // 렌더링
//   return (
//     <div className="card">
//       <div className="card-header">
//         <h3 className="h5 mb-0">토론</h3>
//       </div>
//       <div className="card-body">
//         {comments.map((comment, index) => {
//           const showSection = index === 0 || comments[index - 1].section !== comment.section;

//           return (
//             <React.Fragment key={comment.id}>
//               {showSection && <div className="text-danger mb-2">{comment.section}</div>}
//               <div className="d-flex gap-3 mb-3 p-3 bg-light rounded">
//                 <div
//                   className="bg-dark rounded"
//                   style={{ width: '48px', height: '48px', flexShrink: 0 }}
//                 />
//                 <div className="flex-grow-1 d-flex justify-content-between align-items-start">
//                   <div style={{ whiteSpace: 'pre-line' }}>{comment.content}</div>
//                   <div className="d-flex align-items-center">
//                     <button
//                       className="btn btn-link text-danger p-0"
//                       onClick={() => toggleLike(comment.id)}
//                       style={{ textDecoration: 'none' }}
//                     >
//                       {comment.isLiked ? <HeartFill /> : <Heart />}
//                       <span className="ms-1">{comment.likes}</span>
//                     </button>
//                     {comment.author === currentUser && (
//                       <button
//                         className="btn btn-link text-danger p-0 ms-3"
//                         onClick={() => deleteComment(comment.id)}
//                         style={{ textDecoration: 'none' }}
//                       >
//                         <Trash />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </React.Fragment>
//           );
//         })}

//         <div className="mt-4 bg-light p-3 rounded">
//           <div className="d-flex gap-3 align-items-center">
//             <div
//               className="bg-dark rounded"
//               style={{ width: '48px', height: '48px', flexShrink: 0 }}
//             />
//             <div className="flex-grow-1 d-flex gap-2">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="투자자들과 자유롭게 대화해보세요!"
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//               />
//               <button onClick={addComment} className="btn btn-purple" style={{ minWidth: '80px' }}>
//                 전송
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Discussion;
