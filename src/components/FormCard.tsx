import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";

interface FormCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

const FormCard: React.FC<FormCardProps> = ({ title, description, onPress }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph style={styles.description}>{description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onPress}>Start Audit</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    marginBottom: 10,
  },
});

export default FormCard;
