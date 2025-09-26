import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://medicare-pro-bwiw.onrender.com/api/admin/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (contactId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://medicare-pro-bwiw.onrender.com/api/admin/contacts/${contactId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${status}`);
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  if (loading) {
    return <div className="p-6">Loading contacts...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
      
      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2">
        {['all', 'unread', 'read', 'resolved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${
              filter === status 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({
              status === 'all' ? contacts.length : 
              contacts.filter(c => c.status === status).length
            })
          </button>
        ))}
      </div>

      {/* Contact List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <p className="text-gray-500">No contacts found.</p>
        ) : (
          filteredContacts.map(contact => (
            <div key={contact._id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <p className="text-gray-600">{contact.email}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleString()}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  contact.status === 'unread' ? 'bg-red-100 text-red-600' :
                  contact.status === 'read' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {contact.status}
                </span>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <p className="text-gray-800">{contact.message}</p>
              </div>
              
              <div className="flex gap-2">
                {contact.status === 'unread' && (
                  <button
                    onClick={() => updateStatus(contact._id, 'read')}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                  >
                    Mark as Read
                  </button>
                )}
                {contact.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatus(contact._id, 'resolved')}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
