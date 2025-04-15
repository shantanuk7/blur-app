import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Invalid verification link');
        return;
      }
      try {
        const res = await API.get(`/auth/verify-email?token=${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };
    verifyEmail();
  }, [searchParams]);

  return (
    <div>
      <h2>Email Verification</h2>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailVerification;
