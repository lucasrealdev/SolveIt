import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  findNodeHandle,
  UIManager,
  useWindowDimensions,
} from "react-native";
import PropTypes from "prop-types";
import CustomIcons from "@/assets/icons/CustomIcons";

const Tooltip = ({
  title,
  content,
  iconSize = 40,
  iconColor = "#475569",
  backgroundColor = "#1E293B",
  textColor = "#FFFFFF",
  onClose,
  tooltipStyle,
  titleStyle,
  contentStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const iconRef = useRef(null);
  const { width } = useWindowDimensions();

  const handleOpen = () => {
    if (iconRef.current) {
      UIManager.measure(
        findNodeHandle(iconRef.current),
        (_, __, width, height, pageX, pageY) => {
          setPosition({ x: pageX, y: pageY, width, height });
          setVisible(true);
        }
      );
    }
  };

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <View>
      <TouchableOpacity ref={iconRef} onPress={handleOpen} style={styles.icon}>
        <CustomIcons name="info" size={iconSize} color={iconColor} />
      </TouchableOpacity>

      {visible && position && (
        <Modal transparent animationType="fade" visible={visible}>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={handleClose}
          >
            <View
              style={[
                styles.tooltip,
                {
                  top: position.y + position.height / 2 - 20,
                  left:
                    width < 515
                      ? position.x + position.width + 10
                      : position.x - 330,
                  backgroundColor,
                },
                tooltipStyle,
              ]}
            >
              <Text style={[styles.title, { color: textColor }, titleStyle]}>
                {title}
              </Text>
              <Text style={[styles.content, { color: textColor }, contentStyle]}>
                {content}
              </Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

Tooltip.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  onClose: PropTypes.func,
  tooltipStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  contentStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  icon: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: "#fff",
    borderColor: "#CBD5E1",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  tooltip: {
    position: "absolute",
    maxWidth: 320,
    padding: 15,
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
  },
});

export default Tooltip;