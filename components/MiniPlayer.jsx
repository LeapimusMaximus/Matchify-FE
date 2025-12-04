import { View, Text, TouchableOpacity } from "react-native";

const MiniPlayer = ({ trackInfo, isPlaying, onPause, onPlay, onStop }) => {
  if (!trackInfo) return null;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: "#201e2b",
        borderTopWidth: 1,
        borderColor: "#444",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10,
      }}
    >
      <View>
        <Text style={{ color: "white", fontSize: 14 }}>{trackInfo.title}</Text>
        <Text style={{ color: "#bbb", fontSize: 12 }}>{trackInfo.artist}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <TouchableOpacity
          onPress={isPlaying ? onPause : onPlay}
          style={{ padding: 10 }}
        >
          <Text style={{ color: "white", fontSize: 28 }}>
            {isPlaying ? "⏸" : "▶️"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onStop} style={{ padding: 10 }}>
          <Text style={{ color: "white", fontSize: 22 }}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MiniPlayer;
