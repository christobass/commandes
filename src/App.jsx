import React, { useState } from 'react';
import { Plus, Search, Filter, DollarSign, Package, Clock, CheckCircle, Trash2, Edit, X, TrendingUp, Calendar } from 'lucide-react';

const OrderTrackingApp = () => {
  const [orders, setOrders] = useState([
    {
      id: 'CMD001',
      dateCommande: '2025-10-01',
      client: 'Jean Dupont',
      telephone: '+237 699 123 456',
      produit: 'Dell Latitude 5520 - i7, 16GB RAM, 512GB SSD',
      prixAchatYuan: 3500,
      tauxChange: 85,
      prixVenteCFA: 650000,
      acompte: 455000,
      solde: 195000,
      montantPaye: 455000,
      montantRestant: 195000,
      dateAcompte: '2025-10-01',
      dateSolde: null,
      dateExpedition: '2025-10-03',
      dateArriveePrevu: '2025-10-28',
      dateArriveeEffective: null,
      statut: 'En transit',
      notes: 'Configuration standard'
    },
    {
      id: 'CMD002',
      dateCommande: '2025-09-15',
      client: 'Marie Kouam',
      telephone: '+237 677 987 654',
      produit: 'HP EliteBook 840 G8 - i5, 8GB RAM, 256GB SSD',
      prixAchatYuan: 2800,
      tauxChange: 85,
      prixVenteCFA: 520000,
      acompte: 364000,
      solde: 156000,
      montantPaye: 520000,
      montantRestant: 0,
      dateAcompte: '2025-09-15',
      dateSolde: '2025-10-12',
      dateExpedition: '2025-09-18',
      dateArriveePrevu: '2025-10-10',
      dateArriveeEffective: '2025-10-11',
      statut: 'Livré',
      notes: 'Client satisfait'
    }
  ]);

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

  const handleAddOrder = () => {
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

    const order = {
      id: `CMD${String(orders.length + 1).padStart(3, '0')}`,
      dateCommande: today,
      client: newOrder.client,
      telephone: newOrder.telephone,
      produit: newOrder.produit,
      prixAchatYuan: parseFloat(newOrder.prixAchatYuan) || 0,
      tauxChange: parseFloat(newOrder.tauxChange) || 85,
      prixVenteCFA: prixVenteCFA,
      acompte: acompte,
      solde: solde,
      montantPaye: 0,
      montantRestant: prixVenteCFA,
      dateAcompte: null,
      dateSolde: null,
      dateExpedition: newOrder.dateExpedition || null,
      dateArriveePrevu: arriveeDans28Jours.toISOString().split('T')[0],
      dateArriveeEffective: null,
      statut: 'Acompte en attente',
      notes: newOrder.notes
    };

    setOrders([order, ...orders]);
    setNewOrder({ client: '', telephone: '', produit: '', prixAchatYuan: '', tauxChange: 85, prixVenteCFA: '', dateExpedition: '', notes: '' });
    setShowAddForm(false);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setOrders(orders.filter(order => order.id !== orderToDelete.id));
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  const handleEditClick = (order) => {
    setEditingOrder({...order});
    setShowEditForm(true);
  };

  const handleEditOrder = () => {
    if (!editingOrder.client || !editingOrder.telephone || !editingOrder.produit || !editingOrder.prixVenteCFA) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const prixVenteCFA = parseFloat(editingOrder.prixVenteCFA);
    const acompte = Math.round(prixVenteCFA * 0.7);
    const solde = prixVenteCFA - acompte;
    const montantPaye = parseFloat(editingOrder.montantPaye) || 0;
    const montantRestant = prixVenteCFA - montantPaye;

    setOrders(orders.map(order => 
      order.id === editingOrder.id 
        ? { ...editingOrder, prixVenteCFA, acompte, solde, montantPaye, montantRestant }
        : order
    ));
    
    setShowEditForm(false);
    setEditingOrder(null);
  };

  const handleStatutChange = (orderId, newStatut) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updates = { statut: newStatut };
        const today = new Date().toISOString().split('T')[0];
        
        if (newStatut === 'Commandé' && !order.dateAcompte) {
          updates.dateAcompte = today;
          updates.montantPaye = order.acompte;
          updates.montantRestant = order.solde;
        }
        
        if (newStatut === 'Arrivé' && !order.dateArriveeEffective) {
          updates.dateArriveeEffective = today;
        }
        
        if (newStatut === 'Livré') {
          if (!order.dateSolde) {
            updates.dateSolde = today;
          }
          if (!order.dateArriveeEffective) {
            updates.dateArriveeEffective = today;
          }
          updates.montantPaye = order.prixVenteCFA;
          updates.montantRestant = 0;
        }
        
        return { ...order, ...updates };
      }
      return order;
    }));
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
    enCours: orders.filter(o => !['Livré'].includes(o.statut)).length,
    livrees: orders.filter(o => o.statut === 'Livré').length,
    chiffreAffaires: orders.filter(o => o.statut === 'Livré').reduce((sum, o) => sum + o.prixVenteCFA, 0),
    aEncaisser: orders.filter(o => o.statut !== 'Livré').reduce((sum, o) => sum + o.montantRestant, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Gestion des Commandes</h1>
          <p className="text-gray-600 text-sm md:text-base">Suivi des commandes d'ordinateurs portables</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="text-blue-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">En Cours</p>
                <p className="text-xl md:text-2xl font-bold text-orange-600">{stats.enCours}</p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Livrées</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{stats.livrees}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 col-span-2 md:col-span-1">
            <div>
              <p className="text-xs text-gray-600 mb-1">CA Encaissé</p>
              <p className="text-base md:text-lg font-bold text-purple-600">{formatCFA(stats.chiffreAffaires)}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 col-span-2 md:col-span-1">
            <div>
              <p className="text-xs text-gray-600 mb-1">À Encaisser</p>
              <p className="text-base md:text-lg font-bold text-yellow-600">{formatCFA(stats.aEncaisser)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                >
                  {statuts.map(statut => (
                    <option key={statut} value={statut}>{statut}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Plus size={18} />
              Nouvelle Commande
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-bold mb-4">Nouvelle Commande</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.client}
                  onChange={(e) => setNewOrder({...newOrder, client: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.telephone}
                  onChange={(e) => setNewOrder({...newOrder, telephone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'achat (Yuan)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.prixAchatYuan}
                  onChange={(e) => {
                    const yuan = e.target.value;
                    setNewOrder({
                      ...newOrder, 
                      prixAchatYuan: yuan,
                      prixVenteCFA: calculateFromYuan(yuan, newOrder.tauxChange)
                    });
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taux de change (¥ → FCFA)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.tauxChange}
                  onChange={(e) => {
                    const taux = e.target.value;
                    setNewOrder({
                      ...newOrder, 
                      tauxChange: taux,
                      prixVenteCFA: calculateFromYuan(newOrder.prixAchatYuan, taux)
                    });
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente (FCFA) *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.prixVenteCFA}
                  onChange={(e) => setNewOrder({...newOrder, prixVenteCFA: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expédition</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.dateExpedition}
                  onChange={(e) => setNewOrder({...newOrder, dateExpedition: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit *</label>
                <input
                  type="text"
                  placeholder="Ex: Dell Latitude 5520 - i7, 16GB RAM, 512GB SSD"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.produit}
                  onChange={(e) => setNewOrder({...newOrder, produit: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddOrder}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Créer la commande
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
              </div>
              
              <p className="text-gray-600 mb-2">
                Êtes-vous sûr de vouloir supprimer cette commande ?
              </p>
              
              {orderToDelete && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm"><span className="font-medium">ID:</span> {orderToDelete.id}</p>
                  <p className="text-sm"><span className="font-medium">Client:</span> {orderToDelete.client}</p>
                  <p className="text-sm"><span className="font-medium">Produit:</span> {orderToDelete.produit}</p>
                </div>
              )}
              
              <p className="text-red-600 text-sm mb-4">
                ⚠️ Cette action est irréversible !
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setOrderToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditForm && editingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full my-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Modifier la commande {editingOrder.id}</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingOrder(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package size={18} />
                    Informations Client
                  </h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.client}
                    onChange={(e) => setEditingOrder({...editingOrder, client: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.telephone}
                    onChange={(e) => setEditingOrder({...editingOrder, telephone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.statut}
                    onChange={(e) => setEditingOrder({...editingOrder, statut: e.target.value})}
                  >
                    {statuts.filter(s => s !== 'Tous').map(statut => (
                      <option key={statut} value={statut}>{statut}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Informations Produit & Prix
                  </h3>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produit *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.produit}
                    onChange={(e) => setEditingOrder({...editingOrder, produit: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'achat (Yuan)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.prixAchatYuan}
                    onChange={(e) => setEditingOrder({...editingOrder, prixAchatYuan: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taux de change</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.tauxChange}
                    onChange={(e) => setEditingOrder({...editingOrder, tauxChange: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente (FCFA) *</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.prixVenteCFA}
                    onChange={(e) => setEditingOrder({...editingOrder, prixVenteCFA: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign size={18} />
                    Informations de Paiement
                  </h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant payé (FCFA)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.montantPaye}
                    onChange={(e) => setEditingOrder({...editingOrder, montantPaye: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date paiement avance</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.dateAcompte || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, dateAcompte: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date paiement solde</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.dateSolde || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, dateSolde: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar size={18} />
                    Dates de Livraison
                  </h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expédition</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.dateExpedition || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, dateExpedition: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'arrivée prévue</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.dateArriveePrevu}
                    onChange={(e) => setEditingOrder({...editingOrder, dateArriveePrevu: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'arrivée effective</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.dateArriveeEffective || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, dateArriveeEffective: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        )}

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