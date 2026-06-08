import { useState, useEffect } from "react";

import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase-config";

function useChat(currentUser, userData, selectedProduct) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // ====================
  // GET MESSAGES
  // ====================

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const messagesRef = query(
      collection(db, "conversations", conversationId, "messages"),

      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      messagesRef,

      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setMessages(data);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  // ====================
  // LOAD CONVERSATION
  // ====================

  useEffect(() => {
    const loadConversation = async () => {
      if (!selectedProduct || !currentUser) {
        setConversationId(null);

        setMessages([]);

        return;
      }

      try {
        const existingQuery = query(
          collection(db, "conversations"),

          where("buyerId", "==", currentUser.uid),

          where("productId", "==", selectedProduct.id),
        );

        const existingSnapshot = await getDocs(existingQuery);

        if (!existingSnapshot.empty) {
          setConversationId(existingSnapshot.docs[0].id);
        } else {
          setConversationId(null);

          setMessages([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadConversation();
  }, [selectedProduct, currentUser]);

  // ====================
  // INPUT CHANGE
  // ====================

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // ====================
  // SEND MESSAGE
  // ====================

  const sendMessage = async () => {
    if (!currentUser) {
      alert("Please login first");

      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      let currentConversationId = conversationId;

      // CREATE CONVERSATION

      if (!currentConversationId) {
        const existingQuery = query(
          collection(db, "conversations"),

          where("buyerId", "==", currentUser.uid),

          where("productId", "==", selectedProduct.id),
        );

        const existingSnapshot = await getDocs(existingQuery);

        if (!existingSnapshot.empty) {
          currentConversationId = existingSnapshot.docs[0].id;

          setConversationId(currentConversationId);
        } else {
          const conversationRef = doc(collection(db, "conversations"));

          currentConversationId = conversationRef.id;

          await setDoc(conversationRef, {
            buyerName: userData?.name || currentUser.email,
            buyerEmail: currentUser.email,
            buyerId: currentUser.uid,
            buyerPhoto: userData?.photo || "",
            productId: selectedProduct.id,
            productName: selectedProduct.productName,
            productImage: selectedProduct.imageUrl,
            createdAt: serverTimestamp(),
            lastMessage: message,
            lastUpdated: serverTimestamp(),
          });

          setConversationId(currentConversationId);
        }
      }

      // ====================
      // ADD MESSAGE
      // ====================

      await addDoc(
        collection(db, "conversations", currentConversationId, "messages"),

        {
          sender: "buyer",
          text: message,
          createdAt: serverTimestamp(),
        },
      );

      // ====================
      // UPDATE LAST MESSAGE
      // ====================

      await updateDoc(
        doc(db, "conversations", currentConversationId),

        {
          lastMessage: message,
          lastUpdated: serverTimestamp(),
        },
      );

      // ====================
      // CLEAR INPUT
      // ====================

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // ====================
  // RETURN
  // ====================

  return {
    messages,
    message,
    handleMessageChange,
    sendMessage,
  };
}

export default useChat;
