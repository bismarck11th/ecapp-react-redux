import React, { useCallback, useState } from 'react';
import { push } from 'connected-react-router';
// Redux
import { useDispatch } from 'react-redux';
// Components
import { PrimaryButton, TextInput } from '../components/UIkit/';
//
import { resetPassword } from '../reducks/users/operations';

const Reset = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');

  const inputEmail = useCallback(
    (e) => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">パスワードのリセット</h2>
      <div className="module-spacer--medium" />
      <TextInput
        fullWidth={true}
        label={'メールアドレス'}
        multiple={false}
        required={true}
        rows={1}
        value={email}
        type={'email'}
        onChange={inputEmail}
      />
      <div className="module-spacer--medium" />
      <div className="center">
        <PrimaryButton
          label={'Reset Password'}
          onClick={() => dispatch(resetPassword(email))}
        />
        <div className="module-spacer--medium" />
        <p className="cursor_pointer" onClick={() => dispatch(push('/signin'))}>
          ログイン画面に戻る
        </p>
      </div>
    </div>
  );
};

export default Reset;
