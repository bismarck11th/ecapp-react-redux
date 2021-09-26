import React, { useCallback, useState } from 'react';
import { push } from 'connected-react-router';
// Redux
import { useDispatch } from 'react-redux';
// Components
import { PrimaryButton, TextInput } from '../components/UIkit/';
//
import { signIn } from '../reducks/users/operations';

const SignIn = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputEmail = useCallback(
    (e) => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  const inputPassword = useCallback(
    (e) => {
      setPassword(e.target.value);
    },
    [setPassword]
  );

  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">サインイン</h2>
      <div className="module-spacer--medium" />
      <TextInput
        fullWidth={true}
        label='メールアドレス'
        multiple={false}
        required={true}
        rows={1}
        value={email}
        type='email'
        onChange={inputEmail}
      />
      <TextInput
        fullWidth={true}
        label='パスワード'
        multiple={false}
        required={true}
        rows={1}
        value={password}
        type='password'
        onChange={inputPassword}
      />
      <div className="module-spacer--medium" />
      <div className="center">
        <PrimaryButton
          label='Sign In'
          onClick={() => dispatch(signIn(email, password))}
        />
        <div className="module-spacer--medium" />
        <p className="cursor_pointer" onClick={() => dispatch(push('/signup'))}>
          アカウントをお持ちでない方はこちら
        </p>
        <p
          className="cursor_pointer"
          onClick={() => dispatch(push('/signin/reset'))}
        >
          パスワードをお忘れの方はこちら
        </p>
      </div>
    </div>
  );
};

export default SignIn;
