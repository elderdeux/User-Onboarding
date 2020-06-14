import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';


const formSchema = yup.object().shape({
	name: yup.string().required('Name is a Required Field Slow Down Buddy'),
	email: yup.string().email().required('Hey You.. This is not a valid email'),
	password: yup.string().required('Make sure you remember this!!'),
	role: yup.string(),
	experience: yup.string(),
	motivation: yup.string().required('Why do you want to join the school of Awesomeness'),
	terms: yup.boolean().oneOf([true], 'Please agree to the legal mumbo jumbo'),
});

export default function Forms(){

  // managing state for our form inputs here

  const [formState, setFormState] = useState({
		name: '',
		email: '',
    password: '',
    role: '',
    experience: '',
    motivation: '',
		terms: '',
  });

  // what for state errors

  const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
		role: '',
		experience: '',
		motivation: '',
		terms: '',
	});

  // button wont work till all the fields are correct
  
  const [buttonDisabled, setButtonDisable] = useState(true);



  const [post, setPost] = useState();

 

  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setButtonDisable(!valid);
    });
  }, [formState]);

  

  const validateChange = (e) => {
		yup
			.reach(formSchema, e.target.name)
			.validate(e.target.value)
			.then((valid) => {
				setErrors({
					...errors,
					[e.target.name]: '',
				});
			})
			.catch((err) => {
				setErrors({
					...errors,
					[e.target.name]: err.errors,
				});
			});
  };
  
  const formSubmit = (e) => {
		e.preventDefault();
		axios
			.post('https://reqres.in/api/users', formState)
			.then((res) => {
				setPost(res.data);
				console.log('success', post);

				setFormState({
					name: '',
					email: '',
					password: '',
					role: '',
					experience: '',
					motivation: '',
					terms: '',
				});
			})
			.catch((errors) => {
				console.log(errors.res);
			});
  };
  
  const inputChange = (e) => {
		e.persist();
		const newFormData = {
			...formState,
			[e.target.name]:
				e.target.type === 'checkbox' ? e.target.checked : e.target.value,
		};
		validateChange(e);
		setFormState(newFormData);
	};

  return (
		<form onSubmit={formSubmit}>
			<label htmlFor="name">
				Name
				<input
					id="name"
					type="text"
					name="name"
					value={formState.name}
					onChange={inputChange}
				/>
				{errors.name.length > 0 ? (
					<p className="error">{errors.name}</p>
				) : null}
			</label>

			<label htmlFor="email">
				Email
				<input
					id="email"
					type="text"
					name="email"
					value={formState.email}
					onChange={inputChange}
				/>
				{errors.email.length > 0 ? (
					<p className="error">{errors.email}</p>
				) : null}
			</label>

			<label htmlFor="password">
				Password
				<input
					id="text"
					type="password"
					name="password"
					value={formState.password}
					onChange={inputChange}
				/>
				{errors.password.length > 0 ? (
					<p className="error">{errors.password}</p>
				) : null}
			</label>

			<label htlmFor="role">Role</label>
			<select
				id="role"
				name="role"
				value={formState.role}
				onChange={inputChange}
			>
				<option>Select</option>
				<option value="Android Developer">Android Developer</option>
				<option value="iOS Developer">iOS Developer</option>
				<option value="BackEnd Developer">BackEnd Developer</option>
				<option value="FrontEnd Developer">FrontEnd Developer</option>
				<option value="Full Stack Developer">Full Stack Developer</option>
				<option value="Data Science">Data Science</option>
			</select>

			<label htlmFor="experience">Experience</label>
			<select
				id="experience"
				name="experience"
				value={formState.experience}
				onChange={inputChange}
			>
				<option>Select</option>
				<option value="not applicable.">Not Applicable</option>
				<option value="iOS Developer">
					1 - Fundamental Awareness 
				</option>
				<option value="	2 - novice">
					2 - Novice 
				</option>
				<option value="3 - intermediate">
					3 - Intermediate 
				</option>
				<option value="4 - advanced">
					4 - Advanced 
				</option>
				<option value="5 - expert ">
					5 - Expert
				</option>
			</select>

			<label htmlFor="motivation">
				What is it that has brought you to Lambda School?
				<textarea
					id="motivation"
					name="motivation"
					value={formState.motivation}
					onChange={inputChange}
				/>
				{errors.motivation.length > 0 ? (
					<p className="error">{errors.motivation}</p>
				) : null}
			</label>

			<label htmlFor="terms">
				Terms and Conditions
				<input
					id="terms"
					type="checkbox"
					name="terms"
					checked={formState.terms}
					onChange={inputChange}
				/>
			</label>

			<pre>{JSON.stringify(post, null, 2)}</pre>
			<button disabled={buttonDisabled}>Submit</button>
		</form>
	);
};