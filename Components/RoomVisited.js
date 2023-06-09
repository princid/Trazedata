import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import moment from "moment";
import { DataTable } from "react-native-paper";
import { PRODUCTION_SERVER } from "../services/configs";
import { DEFAULT_ERROR_MESSAGE } from "../utils/app_constants";

const RoomVisited = ({
  navigation,
  route: {
    params: { id, type },
  },
}) => {
  const [roomVisited, setRoomVisited] = useState([]);

  useEffect(() => {
    getValueFor("x-token");
  }, []);

  async function getValueFor(key) {
    let token = await SecureStore.getItemAsync(key);
    if (token) {
      handleGetUserVisitedRooms(id, token);
    } else {
      alert("No values stored under that jwt-token.");
    }
  }

  const handleGetUserVisitedRooms = async (uid, currentToken) => {
    const config = {
      headers: { Authorization: `Bearer ${currentToken}` },
    };

    await axios
      .get(`${PRODUCTION_SERVER}/rooms/visited-rooms/${uid}`, config)
      .then((response) => {
        const success = response.data.success;
        if (success === 0) {
          return alert(DEFAULT_ERROR_MESSAGE);
        }

        if (success === 1) {
          return setRoomVisited(response.data.data);
        }
      })
      .catch(() => {
        alert(DEFAULT_ERROR_MESSAGE);
      });
  };

  const viewHistoryData = (room_id, building_name, room_number, date, time) => {
    Alert.alert(
      "Room visited History",
      "Room ID: " +
        room_id +
        "\n Building name : " +
        building_name +
        "\n Room number: " +
        room_number +
        "\n Date: " +
        date +
        "\n Time: " +
        time,
      [{ text: "OK", onPress: () => {} }]
    );
  };

  return (
    <SafeAreaView>
      <StatusBar animated={true} backgroundColor="#E1F5E4" />
      <View style={styles.mainContainer}>
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
        <View style={{ width: 340, height: "auto" }}>
          <Text style={styles.roomVisitedText}>Room Visited</Text>
        </View>
        <ScrollView style={styles.tableContainer}>
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
                  Room Id
                </Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  Bldg name
                </Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  Room no.
                </Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>Date</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>Time</Text>
              </DataTable.Title>
            </DataTable.Header>

            {roomVisited === [] ? (
              <View>
                <Text style={styles.rowBody}>No rooms visited</Text>
              </View>
            ) : (
              roomVisited.map((room) => {
                return (
                  <DataTable.Row
                    key={room.id}
                    onPress={() => {
                      viewHistoryData(
                        room.room_id,
                        room.building_name,
                        room.room_number,
                        moment(room.createdAt).format("MM-DD-YY"),
                        moment(room.createdAt).format("HH:mm A")
                      );
                    }}
                  >
                    <DataTable.Cell>{room.room_id}</DataTable.Cell>
                    <DataTable.Cell>{room.building_name}</DataTable.Cell>
                    <DataTable.Cell>{room.room_number}</DataTable.Cell>
                    <DataTable.Cell>
                      {moment(room.createdAt).format("MM-DD-YY")}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {moment(room.createdAt).format("HH:mm A")}
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })
            )}
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
    </SafeAreaView>
  );
};

{
  /* <Text>🔔📢📣🎯🕹🛠⚒⚙🛢💻👨‍💻</Text> */
}

export default RoomVisited;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#E1F5E4",
    paddingHorizontal: 40,
    height: "100%",
  },
  roomVisitedText: {
    color: "#364D39",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableContainer: {
    marginBottom: 10,
    borderRadius: 10,
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
    marginLeft: -45,
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  bodyContainer: {
    height: "85%",
    paddingHorizontal: 40,
    borderWidth: 5,
  },
  listWrapperHeader: {
    height: 45,
    width: "100%",
    backgroundColor: "#28CD41",
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 15,
    shadowColor: "#28CD41",
  },
  listWrapper: {
    height: 45,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 0.5,
    borderColor: "#E1F5E4",
    backgroundColor: "white",
  },
  row: {
    flex: 1,
    padding: 15,
    fontSize: 12,
    color: "#E1F5E4",
  },
  rowBody: {
    flex: 1,
    padding: 15,
    fontSize: 12,
    color: "#364D39",
  },
  topContainer: {
    zIndex: 1,
    width: "100%",
    height: "15%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 30,
  },
  menuLogo: {
    height: "50%",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  notifLogo: {
    height: "50%",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  centeredViews: {
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
    height: 474,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
