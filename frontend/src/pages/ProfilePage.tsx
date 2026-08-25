import { useState } from 'react';
import { useAuth, getErrorMessage } from '../context/AuthContext';
import { authApi } from '../services/authService';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.updateProfile(form);
      if (data.data?.user) updateUser(data.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.changePassword(passwords.current, passwords.new);
      setPasswords({ current: '', new: '' });
      setMessage('Password changed successfully');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await authApi.uploadAvatar(file);
      if (data.data?.user) updateUser(data.data.user);
      setMessage('Avatar updated');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold text-zinc-100">Profile Settings</h1>

      {message ? (
        <div className="mt-4 rounded-lg bg-success/10 p-3 text-sm text-success">{message}</div>
      ) : null}
      {error ? (
        <div className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>
      ) : null}

      <Card className="mt-8">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} name={user?.name || 'U'} size="lg" />
          <div>
            <p className="font-medium text-zinc-200">{user?.name}</p>
            <p className="text-sm text-muted">@{user?.username}</p>
            <label className="mt-2 inline-block cursor-pointer text-sm text-accent hover:text-accent-hover">
              Change avatar
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="font-semibold text-zinc-100">Edit Profile</h2>
        <form onSubmit={handleProfileUpdate} className="mt-4 space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Textarea
            label="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
          />
          <Button type="submit" isLoading={loading}>
            Save Changes
          </Button>
        </form>
      </Card>

      <Card className="mt-6">
        <h2 className="font-semibold text-zinc-100">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <Button type="submit" variant="secondary" isLoading={loading}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
};
