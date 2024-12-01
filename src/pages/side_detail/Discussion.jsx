import React, { useState } from 'react';
import { Heart, HeartFill, Trash } from 'react-bootstrap-icons';

function Discussion() {
  const [currentUser] = useState('사용자'); // 현재 로그인한 사용자를 나타냅니다. 실제 앱에서는 인증 시스템과 연동해야 합니다.

  const [comments, setComments] = useState([
    {
      id: 1,
      section: '유정 유정',
      author: '유정',
      content: '위치랑 시설이 다 좋아 보여도 이 매물은 단타 전략이 나을듯 함',
      likes: 15,
      isLiked: false
    },
    {
      id: 2,
      section: '우진 우진',
      author: '우진',
      content: '최근 리모델링 완공으로 해당 빌딩의 임대료 상승이 불가피해보여요..\n지금 가격이 젤 저렴하다고 보이니 세일 할 때 사세요',
      likes: 3,
      isLiked: false
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const toggleLike = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const deleteComment = (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      section: '새 댓글',
      author: currentUser,
      content: newComment,
      likes: 0,
      isLiked: false
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="h5 mb-0">토론</h3>
      </div>
      <div className="card-body">
        {comments.map((comment, index) => {
          const showSection = index === 0 || comments[index - 1].section !== comment.section;
          
          return (
            <React.Fragment key={comment.id}>
              {showSection && (
                <div className="text-danger mb-2">{comment.section}</div>
              )}
              <div className="d-flex gap-3 mb-3 p-3 bg-light rounded">
                <div 
                  className="bg-dark rounded"
                  style={{ width: '48px', height: '48px', flexShrink: 0 }}
                />
                <div className="flex-grow-1 d-flex justify-content-between align-items-start">
                  <div style={{whiteSpace: 'pre-line'}}>
                    {comment.content}
                  </div>
                  <div className="d-flex align-items-center">
                    <button 
                      className="btn btn-link text-danger p-0"
                      onClick={() => toggleLike(comment.id)}
                      style={{ textDecoration: 'none' }}
                    >
                      {comment.isLiked ? <HeartFill /> : <Heart />}
                      <span className="ms-1">{comment.likes}</span>
                    </button>
                    {comment.author === currentUser && (
                      <button 
                        className="btn btn-link text-danger p-0 ms-3"
                        onClick={() => deleteComment(comment.id)}
                        style={{ textDecoration: 'none' }}
                      >
                        <Trash />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        <div className="mt-4 bg-light p-3 rounded">
          <div className="d-flex gap-3 align-items-center">
            <div 
              className="bg-dark rounded"
              style={{ width: '48px', height: '48px', flexShrink: 0 }}
            />
            <div className="flex-grow-1 d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="투자자들과 자유롭게 대화해보세요!"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                onClick={handleSubmit} 
                className="btn btn-purple"
                style={{ minWidth: '80px' }}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discussion;

