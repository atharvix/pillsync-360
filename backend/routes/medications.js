const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getFirestore } = require('../config/firebaseAdmin');
const admin = require('firebase-admin');

/**
 * @route   GET /api/medications
 * @desc    Get all medications for authenticated user
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const db = getFirestore();
    const medicationsRef = db.collection('medications');
    const snapshot = await medicationsRef
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const medications = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      medications.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      });
    });

    res.json({
      success: true,
      count: medications.length,
      data: medications,
    });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/medications/:id
 * @desc    Get single medication by ID
 * @access  Private
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const db = getFirestore();
    const medDoc = await db.collection('medications').doc(req.params.id).get();

    if (!medDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Medication not found',
      });
    }

    const data = medDoc.data();

    // Verify medication belongs to user
    if (data.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have access to this medication',
      });
    }

    res.json({
      success: true,
      data: {
        id: medDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get medication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/medications
 * @desc    Create new medication
 * @access  Private
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, dosage, frequency, start, end, addedBy } = req.body;

    // Validation
    if (!name || !dosage) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Name and dosage are required fields',
      });
    }

    const db = getFirestore();
    const newMed = {
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency || '',
      start: start || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      end: end || '',
      addedBy: addedBy || 'User',
      userId: req.user.uid,
      updated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('medications').add(newMed);
    const createdDoc = await docRef.get();

    res.status(201).json({
      success: true,
      message: 'Medication created successfully',
      data: {
        id: docRef.id,
        ...createdDoc.data(),
        createdAt: createdDoc.data().createdAt?.toDate?.()?.toISOString() || createdDoc.data().createdAt,
        updatedAt: createdDoc.data().updatedAt?.toDate?.()?.toISOString() || createdDoc.data().updatedAt,
      },
    });
  } catch (error) {
    console.error('Create medication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/medications/:id
 * @desc    Update medication
 * @access  Private
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const db = getFirestore();
    const medRef = db.collection('medications').doc(req.params.id);
    const medDoc = await medRef.get();

    if (!medDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Medication not found',
      });
    }

    // Verify medication belongs to user
    if (medDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have access to this medication',
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;

    await medRef.update(updateData);
    const updatedDoc = await medRef.get();

    res.json({
      success: true,
      message: 'Medication updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt?.toDate?.()?.toISOString() || updatedDoc.data().createdAt,
        updatedAt: updatedDoc.data().updatedAt?.toDate?.()?.toISOString() || updatedDoc.data().updatedAt,
      },
    });
  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/medications/:id
 * @desc    Delete medication
 * @access  Private
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const db = getFirestore();
    const medRef = db.collection('medications').doc(req.params.id);
    const medDoc = await medRef.get();

    if (!medDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Medication not found',
      });
    }

    // Verify medication belongs to user
    if (medDoc.data().userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have access to this medication',
      });
    }

    await medRef.delete();

    res.json({
      success: true,
      message: 'Medication deleted successfully',
    });
  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

module.exports = router;

