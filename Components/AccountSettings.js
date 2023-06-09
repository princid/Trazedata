import {
	StyleSheet,
	StatusBar,
	Text,
	View,
	ImageBackground,
	Modal,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { AntDesign } from '@expo/vector-icons';
import { useToast } from "react-native-toast-notifications";
import { PRODUCTION_SERVER } from "../services/configs";


const AccountSettings = ({ navigation, route: { params } }) => {

	const toast = useToast()

	const [showPasswordModal, setShowPasswordModal] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [password, setPassword] = useState('')
	const [token, setToken] = useState(null)
	const [userId, setUserId] = useState(null)

	//Error handlers

	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('Error')

	const deleteAccountPermanently = async (currentToken, id) => {
		if (password === '') {
			setError(true)
			setErrorMessage('Please input your password.')
			return
		}

		const config = {
			headers: { Authorization: `Bearer ${currentToken}` }
		};

		const data = {
			id: id,
			password: password

		}

		setIsLoading(true)
		setError(false)

		try {
			await axios.post(`${PRODUCTION_SERVER}/user/deactivateAccount`, data, config)
				.then((response) => {

					const success = response.data.success;

					if (success === 0) {
						setIsLoading(false)
						setError(true)
						setErrorMessage(response.data.message)
						return
					}

					if (success === 1) {
						setIsLoading(false)
						setError(false)
						navigation.navigate('Login')
						toast.show("Account deactivated...", {
							type: "normal",
							placement: "bottom",
							duration: 1000,
							offset: 30,
							animationType: "slide-in",
						});
						return
					}

				});
		} catch (error) {
			setIsLoading(false)
			setError(true)
			setErrorMessage('Network error')
		}

	}

	useEffect(() => {
		getValueFor("x-token");
	}, [])

	async function getValueFor(key) {
		let result = await SecureStore.getItemAsync(key);
		if (result) {
			setToken(result);
			decodeJwt(result)
		} else {
			alert("No values stored under that jwt-token.");
		}
	}

	const decodeJwt = (currentToken) => {
		var decodedToken = jwtDecode(currentToken);
		setUserId(decodedToken.result.id)
	};


	return (
		<SafeAreaView>
			<StatusBar animated={true} backgroundColor="#E1F5E4" />
			<View style={styles.container}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={showPasswordModal}
					onRequestClose={() => {
						setShowPasswordModal(!showPasswordModal);
					}}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={{ color: 'red' }}>*Once account is deleted it can no longer be retrieved.</Text>
							<TextInput
								placeholder="Password"
								defaultValue={""}
								onChangeText={(text) => {
									setPassword(text);
								}}
								secureTextEntry
								style={styles.input}
							/>
							{
								error ?
									<Text style={{ color: 'red' }}>{errorMessage}</Text>
									:
									isLoading ?
										<Text style={{ color: '#28CD41' }}>Please wait ...</Text>
										:
										null
							}
							<View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
								<TouchableOpacity style={styles.deactivateButton} onPress={() => { deleteAccountPermanently(token, userId) }}>
									<Text style={styles.deactivateButtonText}>Deactivate</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.cancelButton} onPress={() => { setShowPasswordModal(false) }}>
									<Text style={styles.cancelButtonText}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				<View style={styles.topContainer}>
					<View style={styles.backIcon}>
						<TouchableWithoutFeedback onPress={() => { navigation.goBack() }}>
							<ImageBackground
								source={require("../assets/back-icon.png")}
								resizeMode="contain"
								style={styles.image}
							></ImageBackground>
						</TouchableWithoutFeedback>
					</View>

				</View>

				{/*End  Notification View */}
				<View style={styles.bodyContainer}>
					<TouchableOpacity style={styles.settingsOption} onPress={() => { navigation.navigate('UpdatePersonalInfo', { id: params.id, type: params.type, token: token }) }}>
						<Text style={{ fontSize: 15 }}>Update Personal Information</Text>
						<AntDesign name="right" size={15} color="black" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.settingsOption} onPress={() => { navigation.navigate('UpdatePassword', { id: params.id, type: params.type, token: token }) }}>
						<Text style={{ fontSize: 15 }}>Update Password</Text>
						<AntDesign name="right" size={15} color="black" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.deactivateButton} onPress={() => { setShowPasswordModal(true) }}>
						<Text style={styles.deactivateButtonText}>Deactivate Account</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};
export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E1F5E4",
    paddingHorizontal: 40,
    height: "100%",
  },

  topContainer: {
    zIndex: 1,
    width: "100%",
    height: "15%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 0,
  },
  backIcon: {
    height: 60,
    width: 60,
    marginLeft: -15,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  centeredView: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    width: 340,
    height: "auto",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  buttons: {
    width: "100%",
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28CD41",
  },
  modalButton: {
    width: 80,
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28CD41",
    borderWidth: 1,
  },

  bodyContainer: {
    width: "100%",
    height: "80%",
    paddingBottom: 70,
  },
  input: {
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
  deactivateButton: {
    height: 40,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#D2042D",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: "auto",
    width: "100%",
  },
  deactivateButtonText: {
    color: "white",
    fontSize: 18,
	fontWeight: 'bold',
  },
  cancelButton: {
    height: 35,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  cancelButtonText: {
    color: "black",
    fontSize: 15,
  },
  settingsOption: {
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
});
