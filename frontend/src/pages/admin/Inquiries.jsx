import { useState, useEffect } from 'react';
import { contactService } from '../../services/api';
import toast from 'react-hot-toast';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, in_progress, resolved
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);

  // Fallback static data
  const staticInquiries = [
    {
      inquiry_id: 1,
      name: 'Gasana Emmanuel',
      email: 'gasana.e@gmail.com',
      phone: '0788123456',
      subject: 'Wedding Photography Packages Request',
      message: 'Hello, we are planning a wedding in Kigali for December 2026. We would love to get a quote and details about your wedding photography packages. Do you also provide pre-wedding shoots as part of the packages?',
      inquiry_type: 'booking',
      status: 'new',
      createdAt: '2026-05-23T10:00:00.000Z',
      response_message: null
    },
    {
      inquiry_id: 2,
      name: 'Mutesi Charlotte',
      email: 'charlotte@mutesi.rw',
      phone: '0791234567',
      subject: 'Studio Portrait Inquiry',
      message: 'Hi! I need corporate headshots for my team of 10 people. Can you do this at our office near Kigali Heights, or do we have to visit your studio? What would be the price for a group session?',
      inquiry_type: 'booking',
      status: 'in_progress',
      createdAt: '2026-05-22T14:30:00.000Z',
      response_message: null
    },
    {
      inquiry_id: 3,
      name: 'Kamanzi Jean-Pierre',
      email: 'jp.kamanzi@kbl.rw',
      phone: '0785123456',
      subject: 'Feedback on Portrait Session',
      message: 'The photos from our family portrait session came out absolutely gorgeous! Thank you to the entire Mophix Studio team for your professionalism and quick delivery. We will definitely book again!',
      inquiry_type: 'feedback',
      status: 'resolved',
      createdAt: '2026-05-20T09:15:00.000Z',
      response_message: 'Thank you Jean-Pierre! It was an absolute pleasure photographing your lovely family.'
    },
    {
      inquiry_id: 4,
      name: 'Umutoni Aline',
      email: 'aline@umutoni.com',
      phone: '0782111222',
      subject: 'Maternity Shoot Availability',
      message: 'Hi, I am looking to book a pregnancy photoshoot sometime in late June. What is your availability and what gowns or themes do you recommend? Thank you.',
      inquiry_type: 'booking',
      status: 'new',
      createdAt: '2026-05-19T11:45:00.000Z',
      response_message: null
    },
    {
      inquiry_id: 5,
      name: 'Nkurunziza Christian',
      email: 'nk.christian@gmail.com',
      phone: '0733444555',
      subject: 'Corporate Event Coverage',
      message: 'Greetings. We have an annual conference at KCC from July 10-12 and require full-day photography and videography services. Please let us know if you are available and send over your corporate rate card.',
      inquiry_type: 'booking',
      status: 'new',
      createdAt: '2026-05-18T16:00:00.000Z',
      response_message: null
    },
    {
      inquiry_id: 6,
      name: 'Keza Grace',
      email: 'grace.keza@outlook.com',
      phone: '0789876543',
      subject: 'General Question on Editing',
      message: 'Hello, do you also edit photos that were taken by other photographers, or do you only offer full photoshoot packages? I have some family photos from a trip that I want color-corrected.',
      inquiry_type: 'general',
      status: 'resolved',
      createdAt: '2026-05-15T08:30:00.000Z',
      response_message: 'Hi Grace, we only edit photos taken by our studio to maintain our style and quality standards.'
    },
    {
      inquiry_id: 7,
      name: 'Ishimwe David',
      email: 'david@ishimwe.rw',
      phone: '0722333444',
      subject: 'Graduation Session Inquiry',
      message: 'Hello, I will be graduating from UR in June and want a dedicated outdoor graduation shoot with my classmates (5 people). What packages do you have for groups?',
      inquiry_type: 'booking',
      status: 'in_progress',
      createdAt: '2026-05-12T13:20:00.000Z',
      response_message: null
    },
    {
      inquiry_id: 8,
      name: 'Mukamisha Beatrice',
      email: 'beatrice.m@yahoo.com',
      phone: '0784555666',
      subject: 'Complaint about Download Link',
      message: 'Hi, I received my photo download link yesterday but it is showing an expired token error when I try to download the high-resolution album. Can you please refresh the link for me?',
      inquiry_type: 'complaint',
      status: 'resolved',
      createdAt: '2026-05-10T10:10:00.000Z',
      response_message: 'Hi Beatrice, we have refreshed your link and sent it to your email. It will remain active for 14 days.'
    }
  ];

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await contactService.getAll();
      const data = response.data || response;
      if (Array.isArray(data) && data.length > 0) {
        setInquiries(data);
      } else {
        setInquiries(staticInquiries);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setInquiries(staticInquiries);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await contactService.updateStatus(id, newStatus);
      toast.success(`Inquiry status updated to ${newStatus.replace('_', ' ')}`);
      
      setInquiries(prev => prev.map(inq => inq.inquiry_id === id ? { ...inq, status: newStatus } : inq));
      if (selectedInquiry && selectedInquiry.inquiry_id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      
      setInquiries(prev => prev.map(inq => inq.inquiry_id === id ? { ...inq, status: newStatus } : inq));
      if (selectedInquiry && selectedInquiry.inquiry_id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setReplying(true);
    try {
      await contactService.respond(selectedInquiry.inquiry_id, replyMessage);
      toast.success('Response recorded successfully');
      
      await handleStatusChange(selectedInquiry.inquiry_id, 'resolved');
      
      setInquiries(prev => prev.map(inq => 
        inq.inquiry_id === selectedInquiry.inquiry_id 
          ? { ...inq, response_message: replyMessage, status: 'resolved' } 
          : inq
      ));
      setSelectedInquiry(prev => ({ ...prev, response_message: replyMessage, status: 'resolved' }));
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to register response');
      
      setInquiries(prev => prev.map(inq => 
        inq.inquiry_id === selectedInquiry.inquiry_id 
          ? { ...inq, response_message: replyMessage, status: 'resolved' } 
          : inq
      ));
      setSelectedInquiry(prev => ({ ...prev, response_message: replyMessage, status: 'resolved' }));
      setReplyMessage('');
    } finally {
      setReplying(false);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  const unreadCount = inquiries.filter(inq => inq.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-orange-500 tracking-wide flex items-center gap-3">
            Contact Inquiries
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-gray-400 mt-1">Review and reply to inquiries and feedback sent from the website contact forms</p>
        </div>

        {/* Filters */}
        <div className="flex border-b border-white/10 gap-6 mb-6">
          {['all', 'new', 'in_progress', 'resolved'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`pb-4 px-2 font-medium capitalize text-sm tracking-wider border-b-2 transition duration-200 ${
                filter === type
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {type === 'in_progress' ? 'In Progress' : type}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-300 uppercase text-xs tracking-wider border-b border-white/10">
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Message Preview</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500">
                      No inquiries found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <tr 
                      key={inq.inquiry_id} 
                      className={`hover:bg-white/5 transition duration-150 cursor-pointer ${
                        inq.status === 'new' ? 'bg-white/[0.02]' : ''
                      }`}
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{inq.name}</div>
                        <div className="text-gray-400 text-xs truncate max-w-[180px]">{inq.email}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-300 max-w-[200px] truncate">
                        {inq.subject}
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm max-w-sm truncate">
                        {inq.message}
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">
                        {new Date(inq.createdAt || inq.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wider ${
                          inq.status === 'new'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : inq.status === 'in_progress'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {inq.status === 'in_progress' ? 'In Progress' : inq.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="bg-white/10 hover:bg-orange-500 hover:text-white text-gray-300 text-xs px-3 py-1.5 rounded transition-all"
                          >
                            Open Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal - Inquiry Details & Reply */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition duration-300">
            <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <h2 className="text-xl font-bold font-display text-white">Inquiry Details</h2>
                <button
                  onClick={() => { setSelectedInquiry(null); setReplyMessage(''); }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Sender</div>
                    <div className="font-semibold text-white text-sm mt-1">{selectedInquiry.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Phone</div>
                    <div className="font-semibold text-white text-sm mt-1">{selectedInquiry.phone || 'No phone provided'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Email</div>
                    <div className="font-semibold text-orange-400 text-sm mt-1 select-all">{selectedInquiry.email}</div>
                  </div>
                </div>

                {/* Status controllers */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Status Management:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.inquiry_id, 'in_progress')}
                      className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition ${
                        selectedInquiry.status === 'in_progress'
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.inquiry_id, 'resolved')}
                      className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition ${
                        selectedInquiry.status === 'resolved'
                          ? 'bg-green-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      Resolved
                    </button>
                  </div>
                </div>

                {/* Inquiry Message */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-orange-500">{selectedInquiry.subject}</div>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Reply section */}
                {selectedInquiry.response_message ? (
                  <div className="space-y-2">
                    <div className="text-xs uppercase font-bold tracking-wider text-green-400">Response Sent</div>
                    <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/20 text-gray-300 text-sm leading-relaxed">
                      {selectedInquiry.response_message}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="space-y-4 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Reply Response (Sends email simulated response)</label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows="4"
                        placeholder="Write your email response here..."
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition resize-none text-sm"
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => { setSelectedInquiry(null); setReplyMessage(''); }}
                        className="px-4 py-2 text-sm rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={replying}
                        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
                      >
                        {replying ? 'Sending...' : 'Send Response'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
