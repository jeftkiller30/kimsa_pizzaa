const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.crearPedido = functions.https.onRequest(async (req, res) => {
  try {
    const pedido = req.body;

    const docRef = await admin
        .firestore()
        .collection("pedidos")
        .add({
          ...pedido,
          estado: "pendiente",
          fecha: admin.firestore.FieldValue.serverTimestamp(),
        });

    res.status(200).json({
      ok: true,
      pedidoId: docRef.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});
