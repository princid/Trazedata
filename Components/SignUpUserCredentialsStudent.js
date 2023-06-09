import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	FlatList,
	ScrollView,
	KeyboardAvoidingView,
	Image,
	ImageBackground,
	StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import jwt_decode from "jwt-decode";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackActions } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import moment from "moment";
import DropDownPicker from 'react-native-dropdown-picker';

const SignUpUserCredentialsStudent = ({ navigation, route }) => {

	const [date, setDate] = useState("");
	const [type, setType] = useState(route.params.type);
	const [userId, setUserId] = useState(0);
	const [studentNumber, setStudentNumber] = useState("");
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	const [address, setAddress] = useState("");
	const [suffix, setSuffix] = useState("");
	const [gender, setGender] = useState("Rather not say");
	const [course, setCourse] = useState("")
	const [email, setEmail] = useState("")
	const [dateOfBirth, setDateOfBirth] = useState(new Date());
	const [yearAndSection, setYearAndSection] = useState("")

	const [showDatePicker, setShowDatePicker] = useState(false)

	// Error handlers

	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [success, setSuccess] = useState(false)

	const nextScreen = async () => {
		
		if(type === null || type === ''){
			return navigation.dispatch(StackActions.popToTop());
		}
		if(studentNumber === null || studentNumber === ''){
			setError(true)
			setErrorMessage('Please enter your student number')
			return
		}
		if(firstName === null || firstName === ''){
			setError(true)
			setErrorMessage('Please enter your firstname')
			return
		}
		if(lastName === null || lastName === ''){
			setError(true)
			setErrorMessage('Please enter your  lastname')
			return
		}
		if(gender === null || gender === ''){
			setError(true)
			setErrorMessage('Please enter your course')
		}	
		if(address === null || address === ''){
			setError(true)
			setErrorMessage('Please enter your address')
			return
		}
		if(dateOfBirth === null || dateOfBirth === ''){
			setError(true)
			setErrorMessage('Please enter your date of birth')
			return
		}
		if(course === null || course === ''){
			setError(true)
			setErrorMessage('Please enter your course')
			return
		}
		if(yearAndSection === null || yearAndSection === ''){
			setError(true)
			setErrorMessage('Please enter your year and section')
			return
		}

		const  totalYears = moment().diff(moment(dateOfBirth), 'Years')
		
		if(totalYears < 12){
			setError(true)
			setErrorMessage('User below 12 yrs old can\'t use the app')
			return
		}

		setError(false)
		setErrorMessage('')

		const dob = moment(dateOfBirth).format("yyyy-MM-DD");

		navigation.navigate("SignUpCredentialsDocuments", {type, studentNumber, firstName, lastName, middleName,suffix, gender, address, dob,course, yearAndSection});
	}

	
	
	return (
		<SafeAreaView>
		<StatusBar animated={true} backgroundColor="#E1F5E4" barStyle='dark-content'/>
			<KeyboardAvoidingView
				style={{ backgroundColor: "#E1F5E4", height: "100%" }}
			>
				<View style={styles.header}>
					<Image
						source={require("../assets/reg_identifier.png")}
						resizeMode="contain"
						style={{ width: "80%", height: "80%" }}
					/>
				</View>

				<ScrollView style={styles.inputContainer}>
					<View
						style={{
							width: "100%",
							alignItems: "center",
							backgroundColor: "#E1F5E4",
						}}
					>
						<Text style={styles.label}>Student no.</Text>
						<TextInput
							placeholder="Student no."
							defaultValue={""}
							onChangeText={(text) => {
								setStudentNumber(text);
							}}
							style={styles.input}
						/>
					</View>

					<View
						style={{ width: "100%", alignItems: "center", borderRadius: 15 }}
					>
						<Text style={styles.label}>First name</Text>
						<TextInput
							placeholder="First name"
							defaultValue={""}
							onChangeText={(text) => {
								setFirstName(text);
							}}
							style={styles.input}
						/>
					</View>

					<View
						style={{ width: "100%", alignItems: "center", borderRadius: 15 }}
					>
						<Text style={styles.label}>Middle name </Text>
						<TextInput
							placeholder="Middle name"
							defaultValue={""}
							onChangeText={(text) => {
								setMiddleName(text);
							}}
							style={styles.input}
						/>
					</View>

					<View
						style={{ width: "100%", alignItems: "center", borderRadius: 15 }}
					>
						<Text style={styles.label}>Last name</Text>
						<TextInput
							placeholder="Last name"
							defaultValue={""}
							onChangeText={(text) => {
								setLastName(text);
							}}
							style={styles.input}
						/>
					</View>

					<View
						style={{ width: "100%", borderRadius: 15, alignItems: 'center'}}
					>
						<View style={{width: "80%", flexDirection: "row"}}>
							<View style={{width: "50%"}}>
								<Text style={styles.label}>Suffix </Text>
								<TextInput
									placeholder="Suffix"
									defaultValue={""}
									onChangeText={(text) => {
										setSuffix(text);
									}}
									style={styles.suffixInput}
								/>
							</View>

							<View style={{width: "50%"}}>
								<Text style={styles.label}>Gender </Text>
								<Picker
								style={{width: "100%",
								height: 50, color: "#4d7861"}}
								selectedValue={gender}
								onValueChange={value => setGender(value)}
								mode="dialog">
									<Picker.Item label="Rather not say" value="Rather not say" />
									<Picker.Item label="Male" value="Male" />
									<Picker.Item label="Female" value="Female" />
								</Picker>
							</View>
						</View>
						
					</View>

					<View
						style={{ width: "100%", alignItems: "center", borderRadius: 15 }}
					>
						<Text style={styles.label}>Address</Text>
						<TextInput
							placeholder="Address"
							defaultValue={""}
							onChangeText={(text) => {
								setAddress(text);
							}}
							style={styles.input}
						/>
					</View>

					<View
						style={{ width: "100%", alignItems: "center", borderRadius: 15}}
					>
						<Text style={styles.label}>Date of birth</Text>
						
						<View style={{ width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
							<TextInput
								placeholder="Date of birth"
								defaultValue={moment(dateOfBirth).format("yyyy-MM-DD")}
								style={styles.dobInput}
								editable={false}
							/>
							<AntDesign name="calendar" size={37} color="#28CD41" style={{marginRight: 5}} onPress={() => setShowDatePicker(true)}/>
						</View>
				
					</View>

					{
						showDatePicker === true?
						<DateTimePicker
							value={dateOfBirth}
							mode={"date"}
							is24Hour={true}
							onChange={(event, date) => {
								setShowDatePicker(false)
								setDateOfBirth(new Date(date))
							}
							}
							/>
						:
						null
					}

					<View
						style={{ width: "100%", borderRadius: 15, alignItems: 'center'}}
					>
						<View style={{width: "80%", flexDirection: "row"}}>
							<View style={{width: "50%"}}>
								<Text style={styles.label}>Course</Text>
								<TextInput
									placeholder="Course"
									defaultValue={""}
									onChangeText={(text) => {
										setCourse(text);
									}}
									style={styles.courseInput}
								/>
							</View>

							<View style={{width: "50%"}}>
								<Text style={styles.label}>Year and Section </Text>
								<TextInput
									placeholder="Year and Section"
									defaultValue={""}
									onChangeText={(text) => {
										setYearAndSection(text);
									}}
									style={styles.yearAndSectionInput}
								/>
							</View>
						</View>
						
					</View>
					
					

					{
                   		 error? 
						<Text style={styles.errorMessage}>*{errorMessage}</Text>
						:
						<Text style={styles.errorMessage}></Text>
					}

					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							marginBottom: 20,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								navigation.goBack();
							}}
							style={styles.backbutton}
						>
							<Image
								source={require("../assets/back-icon.png")}
								style={{ width: 60, height: 60 }}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								nextScreen();
							}}
							style={styles.button}
						>
							<Text style={styles.buttonText}>Next</Text>
						</TouchableOpacity>
					</View>

				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default SignUpUserCredentialsStudent;

const styles = StyleSheet.create({
	header: {
		width: "100%",
		height: "20%",
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center",
	},
	body: {
		width: "100%",
		height: "100%",
		borderColor: "gray",
		justifyContent: "center",
		alignItems: "center",
	},
	label: {
		width: "80%",
		textAlign: "left",
	},
	errorMessage: {
		alignSelf: "center",
		width: "80%",
		textAlign: "left",
		color: "red",
	},

	button: {
		backgroundColor: "#28CD41",
		padding: 10,
		width: "80%",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
	},
	backbutton: {
		paddingTop: 10,

		marginLeft: 40,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		alignContent: "center",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#ffff",
	},
	input: {
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 0,
		marginRight: 0,
		width: "80%",
		height: 50,
		borderColor: "#28CD41",
		paddingHorizontal: 15,
		borderWidth: 1,
		borderRadius: 10,
		overflow: "hidden",
		paddingVertical: 1,
		fontSize: 16,
		color: "#4d7861",
		backgroundColor: "#ffff",
	},
	suffixInput: {
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 0,
		marginRight: 0,
		width: "95%",
		height: 50,
		borderColor: "#28CD41",
		paddingHorizontal: 15,
		borderWidth: 1,
		borderRadius: 10,
		overflow: "hidden",
		paddingVertical: 1,
		fontSize: 16,
		color: "#4d7861",
		backgroundColor: "#ffff",
	},
	genderInput: {
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 0,
		marginRight: 0,
		width: "100%",
		height: 50,
		borderColor: "#28CD41",
		paddingHorizontal: 15,
		borderWidth: 1,
		borderRadius: 10,
		overflow: "hidden",
		paddingVertical: 1,
		fontSize: 16,
		color: "#4d7861",
		backgroundColor: "#ffff",
	},

	courseInput: {
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 0,
		marginRight: 0,
		width: "95%",
		height: 50,
		borderColor: "#28CD41",
		paddingHorizontal: 15,
		borderWidth: 1,
		borderRadius: 10,
		overflow: "hidden",
		paddingVertical: 1,
		fontSize: 16,
		color: "#4d7861",
		backgroundColor: "#ffff",
	},
	yearAndSectionInput: {
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 0,
		marginRight: 0,
		width: "100%",
		height: 50,
		borderColor: "#28CD41",
		paddingHorizontal: 15,
		borderWidth: 1,
		borderRadius: 10,
		overflow: "hidden",
		paddingVertical: 1,
		fontSize: 16,
		color: "#4d7861",
		backgroundColor: "#ffff",
	},
	dobInput: {
		margin: 5,
		width: "70%",
		height: 50,
		borderColor: "#28CD41",
		paddingHorizontal: 15,
		borderWidth: 1,
		borderRadius: 10,
		overflow: "hidden",
		paddingVertical: 1,
		fontSize: 16,
		color: "#4d7861",
		backgroundColor: "#ffff",
	},
	button: {
		backgroundColor: "#28CD41",
		padding: 10,
		borderRadius: 10,
		marginTop: 5,
		paddingVertical: 18,
		width: 122,
		height: 60,
		marginLeft: "auto",
		marginRight: 41,
	},
	buttonText: {
		color: "#FFF",
		fontStyle: "normal",
		fontWeight: "bold",
		fontSize: 16,
		textAlign: "center",
		textTransform: "uppercase",
	},
	datePickerStyle: {
		width: "80%",
		height: 50,
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "white",
		borderColor: "#28CD41",
		justifyContent: "center",
	},
});
