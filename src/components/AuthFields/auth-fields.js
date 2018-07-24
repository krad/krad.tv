import React from 'react';

function EmailInput(props) {
  return (
    <FormField>
      <label htmlFor='email'>Email</label>
      <input
        className='input'
        type='email'
        name='email'
        placeholder='iam@krad.tv'
        onChange={props.onChange}
        value={props.value} />
    </FormField>
  )
}

function PasswordInput(props) {
  return (
    <FormField>
      <label htmlFor='password'>{props.label || 'Password'}</label>
      <input
        className='input'
        type='password'
        name={props.name || 'password'}
        onChange={props.onChange}
        value={props.value} />
    </FormField>)
}

function FormField(props) {
  return (
    <div className='field'>
      <p className='control'>
        {props.children}
      </p>
    </div>
  )
}

export { EmailInput, PasswordInput }
