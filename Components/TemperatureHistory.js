import {
	StyleSheet,
	StatusBar,
	Text,
	View,
	ImageBackground,
	Image,
	Modal,
	ScrollView,
	TouchableWithoutFeedback,
	Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { DataTable } from 'react-native-paper';
import moment from "moment";
import { PRODUCTION_SERVER } from "../services/configs";
import { DEFAULT_ERROR_MESSAGE } from "../utils/app_constants";

const TemperatureHistory = ({ navigation, route: { params: { id, type } } }) => {

	const [token, setToken] = useState("");
	//Variables for data
	const [currentUserTemperature, setCurrentUserTemperature] = useState("00.0")
	const [allTemperatureHistory, setAllTemperatureHistory] = useState([])

	//Variables for loading

	const [showLoadingModal, setShowLoadingModal] = useState(false)
	const [loadingMessage, setLoadingMessage] = useState("Please wait...")



	//Error Handler variables
	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	useEffect(() => {
		getValueFor("x-token");
	}, []);


	async function getValueFor(key) {
		let result = await SecureStore.getItemAsync(key);
		if (result) {
			setToken(result);
			handleGetUserTemperature(result, id)
			handleGetAllUserTemperatureHistory(result, id)
		} else {
			alert("No values stored under that jwt-token.");
		}
	}

	const handleGetUserTemperature = async (token, id) => {
		setAllTemperatureHistory([])
		const config = {
			headers: { Authorization: `Bearer ${token}` }
		};

		await axios.get(`${PRODUCTION_SERVER}/rooms/temperature-history/${id}`, config)
			.then((response) => {
				const success = response.data.success;
				if (success === 0 && response.data.data === "Not set") {
					return setCurrentUserTemperature('Not set');
				}

				if (success === 0) {
					return alert('Please try again');
				}

				if (success === 1) {
					//setTemp(response.data.data.temperature)
					if (response.data.data === undefined) {
						return setCurrentUserTemperature('Not set')
					}

					if (response.data.data.temperature === undefined || response.data.data.temperature === null || response.data.data.temperature === "") {
						return setCurrentUserTemperature('Not set')
					}

					setCurrentUserTemperature(response.data.data.temperature)

				}
			}).catch(() => {
				alert(DEFAULT_ERROR_MESSAGE)
			})
	}

	const handleRefreshData = async (token, id) => {
		handleGetUserTemperature(token, id)
		handleGetAllUserTemperatureHistory(token, id)
	}

	const handleGetAllUserTemperatureHistory = async (token, id) => {
		const config = {
			headers: { Authorization: `Bearer ${token}` }
		};

		await axios.get(`${PRODUCTION_SERVER}/rooms/temperature-history/${id}`, config)
			.then((response) => {
				const returnArray = response.data.data;
				setAllTemperatureHistory(returnArray)
			}).catch(() => {
				alert(DEFAULT_ERROR_MESSAGE)
			})
	}

	const viewHistoryData = (id, roomId, room_number, building_name, room_name, temperature, createdAt) => {

		Alert.alert(
			"Temperature History",
			" ID: " + id + "\n Room Id: " + roomId
			+ "\n Room number: " + room_number + "\n Building name: " + building_name
			+ "\n Room name: " + room_name + "\n Temperature: " + temperature + "\n Visited at: " + moment.utc(createdAt).local().format("ll") + " " + moment.utc(createdAt).local().format('LT')
			,
			[
				{ text: "OK", onPress: () => { } }
			]
		);
	}

	return (
    <SafeAreaView>
      <StatusBar animated={true} backgroundColor="#E1F5E4" />
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLoadingModal}
          onRequestClose={() => {
            setShowLoadingModal(!showLoadingModal);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                source={require("../assets/loading_icon.gif")}
                resizeMode="contain"
                style={{ width: 100, height: 100 }}
              />
              <Text style={styles.modalText}>{loadingMessage}</Text>
            </View>
          </View>
        </Modal>

        <View style={styles.topContainer}>
          <View style={styles.backIcon}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.goBack();
              }}
            >
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
          <View
            style={{
              width: "100%",
              height: "auto",
            }}
          >
            <Text style={styles.bodyText}>
              My temperature {"\n"}for today is
            </Text>
            <Text
              style={{
                fontSize: 60,
                paddingBottom: 10,
                color: "#28CD41",
                fontWeight: "700",
              }}
            >
              {currentUserTemperature === "" ||
              currentUserTemperature === "Not set"
                ? "Not set"
                : currentUserTemperature + "°C"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 25,
                paddingBottom: 10,
                color: "#000000",
                fontWeight: "700",
                marginLeft: 0,
                marginRight: "auto",
              }}
            >
              History
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                handleRefreshData(token, id);
              }}
            >
              <Image
                source={require("../assets/refresh_icon.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  marginLeft: "auto",
                  marginRight: 0,
                }}
              />
            </TouchableWithoutFeedback>
          </View>
          <ScrollView>
            <DataTable
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "#28CD41",
              }}
            >
              <DataTable.Header
                style={{
                  backgroundColor: "#28CD41",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  elevation: 5,
                }}
              >
                <DataTable.Title>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Bldg name
                  </Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Temp</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Date</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>Time</Text>
                </DataTable.Title>
              </DataTable.Header>
              {allTemperatureHistory === undefined
                ? null
                : allTemperatureHistory.map((tempHistory) => {
                    return (
                      <DataTable.Row
                        key={tempHistory.id}
                        onPress={() => {
                          viewHistoryData(
                            tempHistory.id,
                            tempHistory.room_id,
                            tempHistory.room_number,
                            tempHistory.building_name,
                            tempHistory.room_name,
                            tempHistory.temperature,
                            tempHistory.createdAt
                          );
                        }}
                      >
                        <DataTable.Cell>
                          {tempHistory.building_name}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {tempHistory.temperature}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {moment
                            .utc(tempHistory.createdAt)
                            .local()
                            .format("ll")}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {moment
                            .utc(tempHistory.createdAt)
                            .local()
                            .format("LT")}
                        </DataTable.Cell>
                      </DataTable.Row>
                    );
                  })}
            </DataTable>
            <Text
              style={{
                marginTop: 150,
                marginLeft: 50,
                fontWeight: "600",
              }}
            >
              🛠 UNDER CONSTRUCTION
            </Text>
            <Text
              style={{
                marginTop: 20,
                marginLeft: 50,
                fontWeight: "600",
                marginBottom: 150,
              }}
            >
              📢 BUILD COMING SOON....
            </Text>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default TemperatureHistory;

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
		width: 350,
		height: 'auto',
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
		borderWidth: 1
	},

	bodyContainer: {
		width: "100%",
		height: "80%",
		paddingBottom: 70,
	}
});
