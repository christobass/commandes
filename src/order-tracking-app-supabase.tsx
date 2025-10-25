import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign, Package, Clock, CheckCircle, Trash2, Edit, X, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://pzailvvjosssdluuabaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6YWlsdnZqb3Nzc2RsdXVhYmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTMzNDIsImV4cCI6MjA3NjU2OTM0Mn0.5gfX3gevuD1Q7a9AhYB7i03Rp3e79s0HrrYowWy8Y38';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const OrderTrackingApp = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrder, setNewOrder] = useState({
    client: '',
    telephone: '',
    produit: '',
    prixAchatYuan: '',
    tauxChange: 85,
    prixVenteCFA: '',
    dateExpedition: '',
    notes: ''
  });

  const statuts = ['Tous', 'Acompte en attente', 'Commandé', 'En transit', 'Arrivé', 'Livré'];

  // Charger les commandes depuis Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date_commande', { ascending: false });

      if (error) throw error;

      // Convertir les noms de colonnes snake_case en camelCase
      const formattedOrders = data.map(order => ({
        id: order.id,
        dateCommande: order.date_commande,
        client: order.client,
        telephone: order.telephone,
        produit: order.produit,
        prixAchatYuan: order.prix_achat_yuan,
        tauxChange: order.taux_change,
        prixVenteCFA: order.prix_vente_cfa,
        acompte: order.acompte,
        solde: order.solde,
        montantPaye: order.montant_paye,
        montantRestant: order.montant_restant,
        dateAcompte: order.date_acompte,
        dateSolde: order.date_solde,
        dateExpedition: order.date_expedition,
        dateArriveePrevu: order.date_arrivee_prevu,
        dateArriveeEffective: order.date_arrivee_effective,
        statut: order.statut,
        notes: order.notes
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setError('Erreur lors du chargement des commandes. Vérifiez que la table existe dans Supabase.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les commandes au démarrage
  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatutColor = (statut) => {
    const colors = {
      'Acompte en attente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Commandé': 'bg-blue-100 text-blue-800 border-blue-300',
      'En transit': 'bg-purple-100 text-purple-800 border-purple-300',
      'Arrivé': 'bg-green-100 text-green-800 border-green-300',
      'Livré': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatCFA = (montant) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatYuan = (montant) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' ¥';
  };

  const calculateFromYuan = (yuan, taux) => {
    return Math.round(parseFloat(yuan || 0) * parseFloat(taux || 85));
  };

  const handleAddOrder = async () => {
    if (!newOrder.client || !newOrder.telephone || !newOrder.produit || !newOrder.prixVenteCFA) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const prixVenteCFA = parseFloat(newOrder.prixVenteCFA);
    const acompte = Math.round(prixVenteCFA * 0.7);
    const solde = prixVenteCFA - acompte;

    const today = new Date().toISOString().split('T')[0];
    const arriveeDans28Jours = new Date();
    arriveeDans28Jours.setDate(arriveeDans28Jours.getDate() + 28);

    // Générer un ID unique
    const { data: existingOrders } = await supabase
      .from('orders')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    let nextNumber = 1;
    if (existingOrders && existingOrders.length > 0) {
      const lastId = existingOrders[0].id;
      const lastNumber = parseInt(lastId.replace('CMD', ''));
      nextNumber = lastNumber + 1;
    }

    const order = {
      id: `CMD${String(nextNumber).padStart(3, '0')}`,
      date_commande: today,
      client: newOrder.client,
      telephone: newOrder.telephone,
      produit: newOrder.produit,
      prix_achat_yuan: parseFloat(newOrder.prixAchatYuan) || 0,
      taux_change: parseFloat(newOrder.tauxChange) || 85,
      prix_vente_cfa: prixVenteCFA,
      acompte: acompte,
      solde: solde,
      montant_paye: 0,
      montant_restant: prixVenteCFA,
      date_acompte: null,
      date_solde: null,
      date_expedition: newOrder.dateExpedition || null,
      date_arrivee_prevu: arriveeDans28Jours.toISOString().split('T')[0],
      date_arrivee_effective: null,
      statut: 'Acompte en attente',
      notes: newOrder.notes
    };

    try {
      const { error } = await supabase
        .from('orders')
        .insert([order]);

      if (error) throw error;

      // Recharger les commandes
      await fetchOrders();
      
      setNewOrder({ client: '', telephone: '', produit: '', prixAchatYuan: '', tauxChange: 85, prixVenteCFA: '', dateExpedition: '', notes: '' });
      setShowAddForm(false);
      alert('Commande ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de la commande. Vérifiez la console pour plus de détails.');
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderToDelete.id);

      if (error) throw error;

      await fetchOrders();
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      alert('Commande supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la commande.');
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder({...order});
    setShowEditForm(true);
  };

  const handleEditOrder = async () => {
    if (!editingOrder.client || !editingOrder.telephone || !editingOrder.produit || !editingOrder.prixVenteCFA) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const prixVenteCFA = parseFloat(editingOrder.prixVenteCFA);
    const acompte = Math.round(prixVenteCFA * 0.7);
    const solde = prixVenteCFA - acompte;
    const montantPaye = parseFloat(editingOrder.montantPaye) || 0;
    const montantRestant = prixVenteCFA - montantPaye;

    const updatedOrder = {
      client: editingOrder.client,
      telephone: editingOrder.telephone,
      produit: editingOrder.produit,
      prix_achat_yuan: parseFloat(editingOrder.prixAchatYuan) || 0,
      taux_change: parseFloat(editingOrder.tauxChange) || 85,
      prix_vente_cfa: prixVenteCFA,
      acompte: acompte,
      solde: solde,
      montant_paye: montantPaye,
      montant_restant: montantRestant,
      date_expedition: editingOrder.dateExpedition || null,
      date_arrivee_prevu: editingOrder.dateArriveePrevu,
      statut: editingOrder.statut,
      notes: editingOrder.notes
    };

    try {
      const { error } = await supabase
        .from('orders')
        .update(updatedOrder)
        .eq('id', editingOrder.id);

      if (error) throw error;

      await fetchOrders();
      setShowEditForm(false);
      setEditingOrder(null);
      alert('Commande mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la commande.');
    }
  };

  const handleStatutChange = async (orderId, newStatut) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updates = { statut: newStatut };
    const today = new Date().toISOString().split('T')[0];
    
    if (newStatut === 'Commandé' && !order.dateAcompte) {
      updates.date_acompte = today;
      updates.montant_paye = order.acompte;
      updates.montant_restant = order.solde;
    }
    
    if (newStatut === 'En transit' && !order.dateExpedition) {
      updates.date_expedition = today;
    }
    
    if (newStatut === 'Arrivé' && !order.dateArriveeEffective) {
      updates.date_arrivee_effective = today;
    }
    
    if (newStatut === 'Livré') {
      if (!order.dateArriveeEffective) {
        updates.date_arrivee_effective = today;
      }
      if (!order.dateSolde && order.montantRestant > 0) {
        updates.date_solde = today;
        updates.montant_paye = order.prixVenteCFA;
        updates.montant_restant = 0;
      }
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert('Erreur lors du changement de statut.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatut = filterStatut === 'Tous' || order.statut === filterStatut;
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.produit.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatut && matchesSearch;
  });

  const stats = {
    total: orders.length,
    enCours: orders.filter(o => o.statut !== 'Livré').length,
    livrees: orders.filter(o => o.statut === 'Livré').length,
    montantTotal: orders.reduce((sum, o) => sum + o.prixVenteCFA, 0),
    montantPaye: orders.reduce((sum, o) => sum + o.montantPaye, 0),
    montantRestant: orders.reduce((sum, o) => sum + o.montantRestant, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Package className="text-blue-600" size={40} />
            Suivi des Commandes
          </h1>
          <p className="text-gray-600">Gérez vos commandes d'ordinateurs depuis la Chine</p>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">Erreur de connexion à Supabase</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-red-600 text-sm mt-2">Assurez-vous que la table "orders" existe dans votre base de données Supabase.</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-blue-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Total</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-purple-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">En cours</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.enCours}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Livrées</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.livrees}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-blue-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Total ventes</p>
            </div>
            <p className="text-lg font-bold text-blue-900">{formatCFA(stats.montantTotal)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Payé</p>
            </div>
            <p className="text-lg font-bold text-green-900">{formatCFA(stats.montantPaye)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-orange-600" size={20} />
              <p className="text-xs text-gray-600 font-medium">Restant</p>
            </div>
            <p className="text-lg font-bold text-orange-900">{formatCFA(stats.montantRestant)}</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par client, commande ou produit..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                {statuts.map(statut => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                <Plus size={20} />
                <span className="hidden md:inline">Nouvelle commande</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Order Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Commande</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.client}
                      onChange={(e) => setNewOrder({...newOrder, client: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.telephone}
                      onChange={(e) => setNewOrder({...newOrder, telephone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produit *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOrder.produit}
                    onChange={(e) => setNewOrder({...newOrder, produit: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix achat (¥)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.prixAchatYuan}
                      onChange={(e) => setNewOrder({...newOrder, prixAchatYuan: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taux de change</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.tauxChange}
                      onChange={(e) => setNewOrder({...newOrder, tauxChange: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix vente (FCFA) *</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOrder.prixVenteCFA}
                      onChange={(e) => setNewOrder({...newOrder, prixVenteCFA: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expédition</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOrder.dateExpedition}
                    onChange={(e) => setNewOrder({...newOrder, dateExpedition: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddOrder}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer la commande <strong>{orderToDelete?.id}</strong> ?
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setOrderToDelete(null);
                  }}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Order Modal */}
        {showEditForm && editingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Modifier la Commande</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingOrder(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.client}
                      onChange={(e) => setEditingOrder({...editingOrder, client: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.telephone}
                      onChange={(e) => setEditingOrder({...editingOrder, telephone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produit *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.produit}
                    onChange={(e) => setEditingOrder({...editingOrder, produit: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix achat (¥)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.prixAchatYuan}
                      onChange={(e) => setEditingOrder({...editingOrder, prixAchatYuan: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taux de change</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.tauxChange}
                      onChange={(e) => setEditingOrder({...editingOrder, tauxChange: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix vente (FCFA) *</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingOrder.prixVenteCFA}
                      onChange={(e) => setEditingOrder({...editingOrder, prixVenteCFA: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.statut}
                    onChange={(e) => setEditingOrder({...editingOrder, statut: e.target.value})}
                  >
                    {statuts.filter(s => s !== 'Tous').map(statut => (
                      <option key={statut} value={statut}>{statut}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expédition</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.dateExpedition || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, dateExpedition: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant payé (FCFA)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.montantPaye}
                    onChange={(e) => setEditingOrder({...editingOrder, montantPaye: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    value={editingOrder.notes}
                    onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleEditOrder}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingOrder(null);
                    }}
                    className="px-6 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-4 md:p-6">
                <div className="flex flex-wrap justify-between items-start mb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(order.statut)}`}>
                        {order.statut}
                      </span>
                      {order.montantRestant > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                          Reste : {formatCFA(order.montantRestant)}
                        </span>
                      )}
                      {order.montantRestant === 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                          ✓ Payé intégralement
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Commandé le {new Date(order.dateCommande).toLocaleDateString('fr-FR')}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={order.statut}
                      onChange={(e) => handleStatutChange(order.id, e.target.value)}
                    >
                      {statuts.filter(s => s !== 'Tous').map(statut => (
                        <option key={statut} value={statut}>{statut}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => handleEditClick(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(order)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <Package size={16} />
                        Client & Produit
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700"><span className="font-medium">Nom:</span> {order.client}</p>
                        <p className="text-gray-700"><span className="font-medium">Tél:</span> {order.telephone}</p>
                        <p className="text-gray-700"><span className="font-medium">Produit:</span> {order.produit}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <TrendingUp size={16} />
                        Informations Prix
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700"><span className="font-medium">Prix achat:</span> {formatYuan(order.prixAchatYuan)}</p>
                        <p className="text-gray-700"><span className="font-medium">Taux:</span> {order.tauxChange} FCFA/¥</p>
                        <p className="text-gray-700"><span className="font-medium">Prix achat CFA:</span> <span className="font-bold text-blue-700">{formatCFA(Math.round(order.prixAchatYuan * order.tauxChange))}</span></p>
                        <p className="text-gray-700"><span className="font-medium">Prix vente:</span> <span className="font-bold text-blue-900">{formatCFA(order.prixVenteCFA)}</span></p>
                        <p className="text-gray-700"><span className="font-medium">Marge:</span> <span className="font-bold text-green-700">{formatCFA(order.prixVenteCFA - Math.round(order.prixAchatYuan * order.tauxChange))}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <DollarSign size={16} />
                        Paiements
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Acompte 70%</p>
                          <p className="font-bold text-green-900">{formatCFA(order.acompte)}</p>
                          {order.dateAcompte && (
                            <p className="text-xs text-green-700 mt-0.5">✓ {new Date(order.dateAcompte).toLocaleDateString('fr-FR')}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Solde 30%</p>
                          <p className="font-bold text-green-900">{formatCFA(order.solde)}</p>
                          {order.dateSolde && (
                            <p className="text-xs text-green-700 mt-0.5">✓ {new Date(order.dateSolde).toLocaleDateString('fr-FR')}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Montant payé</p>
                          <p className="font-bold text-blue-900">{formatCFA(order.montantPaye)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Montant restant</p>
                          <p className="font-bold text-orange-900">{formatCFA(order.montantRestant)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                        <Calendar size={16} />
                        Dates
                      </h4>
                      <div className="space-y-1 text-xs">
                        {order.dateExpedition && (
                          <p className="text-gray-700"><span className="font-medium">Expédition:</span> {new Date(order.dateExpedition).toLocaleDateString('fr-FR')}</p>
                        )}
                        <p className="text-gray-700"><span className="font-medium">Arrivée prévue:</span> {new Date(order.dateArriveePrevu).toLocaleDateString('fr-FR')}</p>
                        {order.dateArriveeEffective && (
                          <p className="text-gray-700"><span className="font-medium">Arrivée effective:</span> {new Date(order.dateArriveeEffective).toLocaleDateString('fr-FR')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {order.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
              <Package className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">Aucune commande trouvée</p>
              <p className="text-gray-500 text-sm mt-2">Ajustez vos filtres ou créez une nouvelle commande</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingApp;
