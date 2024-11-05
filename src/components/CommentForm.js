import React, { useState } from 'react';
import { submitCommentForReception } from '../api/hospitalAPI';

const CommentForm = ({ receptionId }) => {
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading true on submit
        try {
            const result = await submitCommentForReception(receptionId, description);
            setMessage(result.message);
            setDescription('');
        } catch (err) {
            setError("Failed to submit comment.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            <h2>Submit a Comment</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your comment here"
                    required
                />
                <button type="submit" disabled={loading}> {/* Disable button while loading */}
                    {loading ? 'Submitting...' : 'Submit Comment'}
                </button>
            </form>
            {message && <div>{message}</div>}
            {error && <div>{error}</div>}
        </div>
    );
};

export default CommentForm;
