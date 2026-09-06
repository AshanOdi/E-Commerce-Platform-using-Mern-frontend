import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Read-only star row.
function Stars({ value, size = 16 }) {
  return (
    <span className="inline-flex text-yellow-500">
      {[1, 2, 3, 4, 5].map((n) =>
        n <= value ? <FaStar key={n} size={size} /> : <FaRegStar key={n} size={size} />
      )}
    </span>
  );
}

// Clickable star picker.
function StarPicker({ value, onChange }) {
  return (
    <span className="inline-flex text-yellow-500">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-0.5"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          {n <= value ? <FaStar size={22} /> : <FaRegStar size={22} />}
        </button>
      ))}
    </span>
  );
}

// "loading" | "success" | "error"
export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average: 0, count: 0, distribution: {} });
  const [status, setStatus] = useState("loading");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function fetchReviews() {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/review/" + productId)
      .then((res) => {
        setReviews(res.data.reviews);
        setSummary(res.data.summary);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    setStatus("loading");
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const myReview = user ? reviews.find((r) => String(r.userId) === user.id) : null;
  const authHeader = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };

  async function submitReview(e) {
    e.preventDefault();
    if (rating < 1 || !comment.trim()) {
      toast.error("Pick a rating and write a comment");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/review",
        { productId, rating, comment },
        authHeader
      );
      toast.success("Review posted");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not post review");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveEdit(reviewId) {
    if (rating < 1 || !comment.trim()) {
      toast.error("Pick a rating and write a comment");
      return;
    }
    setSubmitting(true);
    try {
      await axios.patch(
        import.meta.env.VITE_BACKEND_URL + "/api/review/" + reviewId,
        { rating, comment },
        authHeader
      );
      toast.success("Review updated");
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update review");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeReview(reviewId) {
    try {
      await axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/review/" + reviewId, authHeader);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete review");
    }
  }

  function startEdit(review) {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  }

  return (
    <div className="w-full border-t border-gray-200 mt-10 pt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>

      {status === "loading" && <p className="text-gray-500 text-sm">Loading reviews…</p>}
      {status === "error" && (
        <p className="text-gray-500 text-sm">Couldn’t load reviews right now.</p>
      )}

      {status === "success" && (
        <>
          {/* Summary */}
          {summary.count > 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-800">
                  {summary.average.toFixed(1)}
                </span>
                <div>
                  <Stars value={Math.round(summary.average)} />
                  <p className="text-xs text-gray-500">
                    {summary.count} review{summary.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex-1 max-w-xs">
                {[5, 4, 3, 2, 1].map((star) => {
                  const c = summary.distribution[star] || 0;
                  const pct = summary.count ? (c / summary.count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-3">{star}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-yellow-500 rounded"
                          style={{ width: pct + "%" }}
                        ></div>
                      </div>
                      <span className="w-6 text-right">{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-6">No reviews yet.</p>
          )}

          {/* Write a review */}
          {!user && (
            <p className="text-sm text-gray-600 mb-6">
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>{" "}
              to write a review.
            </p>
          )}

          {user && !myReview && editingId === null && (
            <form
              onSubmit={submitReview}
              className="bg-white rounded-2xl shadow-md p-5 mb-6 flex flex-col gap-3"
            >
              <span className="text-sm font-medium text-gray-700">Your rating</span>
              <StarPicker value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Share what you think about this product…"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={submitting}
                className="self-start bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg"
              >
                {submitting ? "Posting…" : "Post review"}
              </button>
            </form>
          )}

          {/* Reviews list */}
          <div className="flex flex-col gap-4">
            {reviews.map((r) => {
              const mine = user && String(r.userId) === user.id;
              const isEditing = editingId === r._id;
              return (
                <div key={r._id} className="border-b border-gray-100 pb-4">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <StarPicker value={rating} onChange={setRating} />
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        maxLength={1000}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(r._id)}
                          disabled={submitting}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs px-4 py-1.5 rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs px-4 py-1.5 rounded-md border border-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800">{r.userName}</span>
                        {r.isVerifiedPurchase && (
                          <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(r.date).toLocaleDateString()}
                        </span>
                      </div>
                      <Stars value={r.rating} size={14} />
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{r.comment}</p>
                      {mine && (
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => startEdit(r)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeReview(r._id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
