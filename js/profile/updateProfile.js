import NoroffAPI from './../api.js';
import {
  displayOverlay,
  createOverlayForm,
  createInputDiv,
  createSubmitButton,
} from './../utils/overlay.js';

const api = new NoroffAPI();
const editProfileBtn = document.getElementById('edit-profile-btn');

async function showEditProfileOverlay() {
  const user = await api.profile.view();

  const bioInput = createInputDiv('bio', {
    value: user.bio || '',
    placeholder: 'Tell people about yourself',
  });

  const avatarUrlInput = createInputDiv('avatarUrl', {
    labelText: 'Avatar URL',
    type: 'url',
    value: user.avatar?.url || '',
    placeholder: 'Enter valid URL for avatar image',
  });

  const avatarAltInput = createInputDiv('avatarAlt', {
    labelText: 'Avatar Alt',
    value: user.avatar?.alt || '',
    placeholder: 'Describe your avatar',
  });

  const bannerUrlInput = createInputDiv('bannerUrl', {
    labelText: 'Banner URL',
    type: 'url',
    value: user.banner?.url || '',
    placeholder: 'Enter valid URL for banner image',
  });

  const bannerAltInput = createInputDiv('bannerAlt', {
    labelText: 'Banner Alt',
    value: user.banner?.alt || '',
    placeholder: 'Describe your banner',
  });

  const submitBtn = createSubmitButton('save changes');

  const form = createOverlayForm([
    bioInput,
    avatarUrlInput,
    avatarAltInput,
    bannerUrlInput,
    bannerAltInput,
    submitBtn,
  ]);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const updates = {
      bio: formData.get('bio'),
      avatar: {
        url: formData.get('avatarUrl'),
        alt: formData.get('avatarAlt'),
      },
      banner: {
        url: formData.get('bannerUrl'),
        alt: formData.get('bannerAlt'),
      },
    };

    await api.profile.update(updates);
    form.closest('.overlay')?.remove();
    document.querySelector('.overlay-bg')?.remove();
  });

  displayOverlay('Edit profile', form);
}

editProfileBtn.addEventListener('click', showEditProfileOverlay);

// TODO:
// Needs refactoring
