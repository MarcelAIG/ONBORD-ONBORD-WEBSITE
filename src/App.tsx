import React, { useState } from 'react';
import { Card, Input, Textarea } from './components/ui';
import { FileUpload } from './components/FileUpload';
import { PhotoGalleryUpload } from './components/PhotoGalleryUpload';
import { RadioGroup } from './components/RadioGroup';
import { CheckboxGroup } from './components/CheckboxGroup';
import { RepeatableTreatments, TreatmentItem } from './components/RepeatableTreatments';
import { RepeatableTeam, TeamMemberItem } from './components/RepeatableTeam';
import { FileData } from './types';
import { CheckCircle2, Loader2, ShieldAlert, Info } from 'lucide-react';

export default function App() {
  // Section 1 - Business Information
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [aboutBusiness, setAboutBusiness] = useState('');
  const [websiteLanguages, setWebsiteLanguages] = useState<string[]>([]);
  const [otherWebsiteLanguage, setOtherWebsiteLanguage] = useState('');

  // Section 2 - Location & Opening Hours
  const [whereServices, setWhereServices] = useState('');
  const [salonAddress, setSalonAddress] = useState('');
  const [travelAreas, setTravelAreas] = useState('');
  const [googleHoursCorrect, setGoogleHoursCorrect] = useState('');
  const [correctHours, setCorrectHours] = useState('');

  // Section 3 - Treatments, Services & Prices
  const [servicesOnline, setServicesOnline] = useState('');
  const [servicesOnlineWhere, setServicesOnlineWhere] = useState<string[]>([]);
  const [servicesOnlineUrl, setServicesOnlineUrl] = useState('');
  const [servicesOnlineAccurate, setServicesOnlineAccurate] = useState('');
  const [servicesOnlineChanges, setServicesOnlineChanges] = useState('');
  const [manualTreatments, setManualTreatments] = useState<TreatmentItem[]>([
    { id: '1', name: '', duration: '', price: '', description: '' }
  ]);
  const [featuredTreatments, setFeaturedTreatments] = useState('');
  const [priceDisplay, setPriceDisplay] = useState('');
  const [specialOffers, setSpecialOffers] = useState<string[]>([]);
  const [otherSpecialOffers, setOtherSpecialOffers] = useState('');
  const [specialOffersDetails, setSpecialOffersDetails] = useState('');

  // Section 4 - Booking & Customer Contact
  const [bookingSystem, setBookingSystem] = useState('');
  const [bookingSystemName, setBookingSystemName] = useState('');
  const [bookingPageLink, setBookingPageLink] = useState('');
  const [contactMethods, setContactMethods] = useState<string[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [preArrivalNotice, setPreArrivalNotice] = useState('');

  // Section 5 - Business & Team
  const [showTeam, setShowTeam] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([
    { id: '1', name: '', role: '', description: '' }
  ]);
  const [servedLanguages, setServedLanguages] = useState<string[]>([]);
  const [otherServedLanguages, setOtherServedLanguages] = useState('');
  const [specialTechniques, setSpecialTechniques] = useState('');

  // Section 6 - Photos & Content
  const [fileState, setFileState] = useState<Record<string, FileData[]>>({
    'Business Logo': [],
    'Salon / Studio Photos': [],
    'Massage / Treatment Photos': [],
    'Therapist / Team Photos': [],
    'Exterior / Entrance Photos': [],
    'Other Photos or Files': []
  });
  const [photosNotToUse, setPhotosNotToUse] = useState('');

  // Section 7 - Online Profiles
  const [googleProfileLink, setGoogleProfileLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [bookingProfileLink, setBookingProfileLink] = useState('');
  const [otherLink, setOtherLink] = useState('');

  // Section 8 - Domain
  const [domainOwned, setDomainOwned] = useState('');
  const [domainName, setDomainName] = useState('');

  // Section 9 - Additional Information
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Submission & Confirmation State
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [submitState, setSubmitState] = useState({
    isSubmitting: false,
    statusText: '',
    progressText: '',
    error: null as string | null
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (label: string, files: FileData[]) => {
    setFileState(prev => ({ ...prev, [label]: files }));
  };

  const uploadFile = async (file: FileData, folderId: string) => {
    const payload = {
      action: 'uploadFile',
      type: 'uploadFile',
      folderId,
      folder_id: folderId,
      file: { name: file.name, type: file.type, data: file.base64 },
      fileName: file.name,
      fileType: file.type,
      fileData: file.base64,
      name: file.name,
      base64: file.base64
    };
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Upload failed on server');
    }
    return true;
  };

  const updateFileStatus = (fileId: string, status: 'waiting' | 'uploading' | 'uploaded' | 'failed') => {
    setFileState(prev => {
      const next = { ...prev };
      for (const key in next) {
        next[key] = next[key].map(f => f.id === fileId ? { ...f, status } : f);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmCheckbox) {
      setSubmitState(prev => ({ ...prev, error: 'Please confirm that the information is correct.' }));
      return;
    }

    // Specific validation checks
    if (!businessName.trim()) {
      setSubmitState(prev => ({ ...prev, error: 'Please enter your Business Name.' }));
      return;
    }
    if (!businessPhone.trim()) {
      setSubmitState(prev => ({ ...prev, error: 'Please enter your Business Phone.' }));
      return;
    }
    if (!businessEmail.trim()) {
      setSubmitState(prev => ({ ...prev, error: 'Please enter your Business Email.' }));
      return;
    }
    if (!whereServices) {
      setSubmitState(prev => ({ ...prev, error: 'Please select where you provide your services in Section 2.' }));
      return;
    }
    if (bookingSystem && bookingSystem !== 'No online booking system' && !bookingPageLink.trim()) {
      setSubmitState(prev => ({ ...prev, error: 'Please provide your Booking Page Link in Section 4.' }));
      return;
    }
    if (domainOwned === 'Yes' && !domainName.trim()) {
      setSubmitState(prev => ({ ...prev, error: 'Please provide your Domain Name in Section 8.' }));
      return;
    }

    setSubmitState({
      isSubmitting: true,
      statusText: 'Starting submission...',
      progressText: '',
      error: null
    });

    try {
      // 1. Prepare structured form field dictionary
      const fieldsPayload: Record<string, string> = {
        // Section 1
        "Business Name": businessName.trim(),
        "Business Phone": businessPhone.trim(),
        "Business Email": businessEmail.trim(),
        "Business Address": businessAddress.trim(),
        "About the Business": aboutBusiness.trim(),
        "Website Languages": [
          ...websiteLanguages.filter(l => l !== 'Other'),
          ...(websiteLanguages.includes('Other') && otherWebsiteLanguage.trim() ? [`Other (${otherWebsiteLanguage.trim()})`] : [])
        ].join(', '),

        // Section 2
        "Where do you provide your services?": whereServices,
        "Salon / Studio Address": (whereServices === 'At our salon / studio' || whereServices === 'Both') ? salonAddress.trim() : '',
        "Areas you travel to": (whereServices === "At customers' homes" || whereServices === 'Both') ? travelAreas.trim() : '',
        "Are your opening hours on Google currently correct?": googleHoursCorrect,
        "Correct Opening Hours": googleHoursCorrect === 'No' ? correctHours.trim() : '',

        // Section 3
        "Are your current treatments, durations and prices already listed online?": servicesOnline,
        "Where can we find your current services and prices?": (servicesOnline === 'Yes' || servicesOnline === 'Partially') ? servicesOnlineWhere.join(', ') : '',
        "Link to your services / booking / price list": (servicesOnline === 'Yes' || servicesOnline === 'Partially') ? servicesOnlineUrl.trim() : '',
        "Is the information at the link above currently correct and up to date?": (servicesOnline === 'Yes' || servicesOnline === 'Partially') ? servicesOnlineAccurate : '',
        "What needs to be changed?": (servicesOnlineAccurate === 'Mostly — I will explain the changes below' || servicesOnlineAccurate === 'No') ? servicesOnlineChanges.trim() : '',
        "Manual Treatments": servicesOnline === 'No'
          ? manualTreatments
              .filter(t => t.name.trim())
              .map((t, idx) => `${idx + 1}. ${t.name} (${t.duration}) - ${t.price}${t.description ? ` | ${t.description}` : ''}`)
              .join('\n')
          : '',
        "Featured Treatments": featuredTreatments.trim(),
        "Website Price Display": priceDisplay,
        "Special Offers": [
          ...specialOffers.filter(o => o !== 'Other'),
          ...(specialOffers.includes('Other') && otherSpecialOffers.trim() ? [`Other (${otherSpecialOffers.trim()})`] : [])
        ].join(', '),
        "Special Offers Details": (specialOffers.length > 0 && !specialOffers.includes('None')) ? specialOffersDetails.trim() : '',

        // Section 4
        "Do you currently use an online booking system?": bookingSystem,
        "Booking System Name": bookingSystem === 'Another booking system' ? bookingSystemName.trim() : (bookingSystem !== 'No online booking system' ? bookingSystem : ''),
        "Booking Page Link": bookingSystem !== 'No online booking system' ? bookingPageLink.trim() : '',
        "How should customers be able to contact you?": contactMethods.join(', '),
        "WhatsApp Number": contactMethods.includes('WhatsApp') ? whatsappNumber.trim() : '',
        "Contact Email": contactMethods.includes('Email') ? (contactEmail.trim() || businessEmail.trim()) : '',
        "Is there anything customers should know before booking or arriving?": preArrivalNotice.trim(),

        // Section 5
        "Would you like your massage therapists or team members shown on the website?": showTeam,
        "Team Members": showTeam === 'Yes'
          ? teamMembers
              .filter(m => m.name.trim())
              .map((m, idx) => `${idx + 1}. ${m.name} (${m.role})${m.description ? `: ${m.description}` : ''}`)
              .join('\n')
          : '',
        "What languages can customers be served in?": [
          ...servedLanguages.filter(l => l !== 'Other'),
          ...(servedLanguages.includes('Other') && otherServedLanguages.trim() ? [`Other (${otherServedLanguages.trim()})`] : [])
        ].join(', '),
        "Special Techniques, Therapists or Business Highlights": specialTechniques.trim(),

        // Section 6
        "Photos Not To Use": photosNotToUse.trim(),

        // Section 7
        "Google Business Profile / Google Maps Link": googleProfileLink.trim(),
        "Instagram": instagramLink.trim(),
        "Facebook": facebookLink.trim(),
        "TikTok": tiktokLink.trim(),
        "Booking Profile Link": bookingProfileLink.trim(),
        "Other Important Link": otherLink.trim(),

        // Section 8
        "Do you already own a domain name?": domainOwned,
        "Domain Name": domainOwned === 'Yes' ? domainName.trim() : '',

        // Section 9
        "Anything Else We Should Know?": additionalInfo.trim()
      };

      // 2. Start submission (Create folder in Drive using Business Name)
      const cleanBusinessName = businessName.trim();
      const startPayload = {
        action: 'start',
        type: 'start',
        businessName: cleanBusinessName,
        clientName: cleanBusinessName,
        folderName: cleanBusinessName,
        name: cleanBusinessName,
        'Business Name': cleanBusinessName
      };

      const startRes = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startPayload)
      });

      const startData = await startRes.json().catch(() => ({}));
      if (!startRes.ok || !startData.success) {
        throw new Error(startData.error || 'Failed to create client folder');
      }
      const folderId = startData.folderId || '';

      // 3. Process and upload ALL files
      const allFiles = Object.values(fileState).flat() as FileData[];
      const pendingFiles = allFiles.filter(f => f.status !== 'uploaded');
      const totalFiles = allFiles.length;
      let uploadedCount = totalFiles - pendingFiles.length;

      if (pendingFiles.length > 0) {
        setSubmitState(prev => ({
          ...prev,
          statusText: 'Uploading your photos and files. Please do not close this page.'
        }));
      }

      for (let i = 0; i < pendingFiles.length; i++) {
        const photo = pendingFiles[i];

        setSubmitState(prev => ({
          ...prev,
          progressText: `Uploading files: ${uploadedCount + 1} / ${totalFiles}`
        }));

        updateFileStatus(photo.id, 'uploading');

        let success = false;
        try {
          await uploadFile(photo, folderId);
          success = true;
        } catch (err) {
          console.error(`Upload failed for ${photo.name}:`, err);
        }

        if (success) {
          uploadedCount++;
          updateFileStatus(photo.id, 'uploaded');
        } else {
          updateFileStatus(photo.id, 'failed');
          setSubmitState(prev => ({
            ...prev,
            isSubmitting: false,
            error: `Failed to upload ${photo.name}. Please try again with a smaller file or check your connection.`,
            statusText: '',
            progressText: ''
          }));
          return;
        }
      }

      // 4. Final Form Submission
      setSubmitState(prev => ({ ...prev, statusText: 'Submitting final form information...', progressText: '' }));

      const finalPayload = {
        action: 'finalize',
        type: 'finalize',
        folderId,
        folder_id: folderId,
        businessName: cleanBusinessName,
        clientName: cleanBusinessName,
        'Business Name': cleanBusinessName,
        uploadedFilesCount: uploadedCount,
        fields: fieldsPayload,
        ...fieldsPayload
      };

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      console.error(err);
      setSubmitState(prev => ({
        ...prev,
        isSubmitting: false,
        error: err?.message || 'Some information or files could not be submitted. Please try again.',
        statusText: '',
        progressText: ''
      }));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-zinc-50">Thank You!</h2>
          <p className="text-zinc-400">
            Thank you! Your information and files were submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 font-sans">
      <div className="max-w-3xl mx-auto px-3.5 sm:px-6 py-8 sm:py-16">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-14">
          <img
            src="https://plain-weur-prod-public.komododecks.com/202608/13/cAhRqB6qoV4bkjrEdeYC/image.png"
            alt="Company Logo"
            className="h-16 sm:h-20 md:h-24 w-auto mx-auto mb-4 sm:mb-6 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-50 mb-3 sm:mb-4">
            Website Information
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed text-xs sm:text-sm md:text-base px-2">
            Please complete the information below so we have everything needed to build your website. If information is already available through your existing booking system, Google profile or another online profile, you can simply provide the link instead of entering everything again.
          </p>
        </div>

        {submitState.error && (
          <div className="mb-6 sm:mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm">
            {submitState.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

          {/* SECTION 1 — BUSINESS INFORMATION */}
          <Card title="1. Business Information">
            <Input
              id="business-name"
              label="Business Name"
              placeholder="e.g. Lotus Thai Massage"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />

            <Input
              id="business-phone"
              label="Business Phone"
              placeholder="e.g. +33 1 23 45 67 89"
              required
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
            />

            <Input
              id="business-email"
              label="Business Email"
              type="email"
              placeholder="contact@yourbusiness.com"
              required
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
            />

            <Input
              id="business-address"
              label="Business Address"
              placeholder="e.g. 12 Rue de la Paix, 75002 Paris"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />

            <Textarea
              id="about-business"
              label="About the Business"
              explanation="Tell us anything you would like customers to know about the business, your experience, approach, atmosphere or story. Optional."
              placeholder="Tell us anything you would like customers to know about the business..."
              value={aboutBusiness}
              onChange={(e) => setAboutBusiness(e.target.value)}
            />

            <CheckboxGroup
              label="Website Languages"
              options={['French', 'English', 'Thai', 'Other']}
              selectedValues={websiteLanguages}
              onChange={setWebsiteLanguages}
              explanation="Select all languages in which you would like your website to be available."
            />

            {websiteLanguages.includes('Other') && (
              <Input
                id="other-website-language"
                label="Other Website Languages"
                placeholder="e.g. German, Spanish, Italian"
                value={otherWebsiteLanguage}
                onChange={(e) => setOtherWebsiteLanguage(e.target.value)}
              />
            )}
          </Card>

          {/* SECTION 2 — LOCATION & OPENING HOURS */}
          <Card title="2. Location & Opening Hours">
            <RadioGroup
              label="Where do you provide your services?"
              options={['At our salon / studio', "At customers' homes", 'Both']}
              value={whereServices}
              onChange={setWhereServices}
              required
            />

            {(whereServices === 'At our salon / studio' || whereServices === 'Both') && (
              <Input
                id="salon-address"
                label="Salon / Studio Address"
                placeholder="Full address, floor, door code, access details..."
                value={salonAddress}
                onChange={(e) => setSalonAddress(e.target.value)}
                required
              />
            )}

            {(whereServices === "At customers' homes" || whereServices === 'Both') && (
              <Textarea
                id="travel-areas"
                label="Areas you travel to"
                explanation="Cities, neighbourhoods or areas where you provide mobile massage services."
                placeholder="e.g. Paris 1st to 8th arrondissements, Neuilly-sur-Seine, Boulogne..."
                value={travelAreas}
                onChange={(e) => setTravelAreas(e.target.value)}
                required
              />
            )}

            <RadioGroup
              label="Are your opening hours on Google currently correct?"
              options={['Yes', 'No', 'We do not have a Google Business Profile', 'Not sure']}
              value={googleHoursCorrect}
              onChange={setGoogleHoursCorrect}
            />

            {googleHoursCorrect === 'No' && (
              <Textarea
                id="correct-opening-hours"
                label="Please enter the correct opening hours."
                placeholder="e.g. Monday - Saturday: 10:00 - 20:00, Sunday: Closed"
                value={correctHours}
                onChange={(e) => setCorrectHours(e.target.value)}
              />
            )}
          </Card>

          {/* SECTION 3 — TREATMENTS, SERVICES & PRICES */}
          <Card
            title="3. Treatments, Services & Prices"
            subtitle="The purpose of this section is to avoid making you manually enter information that already exists online."
          >
            <RadioGroup
              label="Are your current treatments, durations and prices already listed online?"
              options={['Yes', 'No', 'Partially']}
              value={servicesOnline}
              onChange={setServicesOnline}
              required
            />

            {(servicesOnline === 'Yes' || servicesOnline === 'Partially') && (
              <div className="space-y-6 pt-2 border-t border-zinc-800/80">
                <CheckboxGroup
                  label="Where can we find your current services and prices?"
                  options={['Fresha', 'Treatwell', 'Planity', 'Google', 'Existing website', 'Instagram', 'PDF / price menu', 'Other']}
                  selectedValues={servicesOnlineWhere}
                  onChange={setServicesOnlineWhere}
                />

                <Textarea
                  id="services-online-url"
                  label="Link to your services / booking / price list"
                  explanation="If your services and prices are already correct online, you do not need to enter everything again."
                  placeholder="Paste links to your booking profile, website, Instagram menu, price list, etc."
                  value={servicesOnlineUrl}
                  onChange={(e) => setServicesOnlineUrl(e.target.value)}
                />

                <RadioGroup
                  label="Is the information at the link above currently correct and up to date?"
                  options={['Yes — you can use it', 'Mostly — I will explain the changes below', 'No']}
                  value={servicesOnlineAccurate}
                  onChange={setServicesOnlineAccurate}
                />

                {(servicesOnlineAccurate === 'Mostly — I will explain the changes below' || servicesOnlineAccurate === 'No') && (
                  <Textarea
                    id="services-changes"
                    label="What needs to be changed?"
                    placeholder="Describe any price changes, removed treatments, updated durations or new services..."
                    value={servicesOnlineChanges}
                    onChange={(e) => setServicesOnlineChanges(e.target.value)}
                  />
                )}
              </div>
            )}

            {servicesOnline === 'No' && (
              <div className="pt-2 border-t border-zinc-800/80">
                <RepeatableTreatments
                  treatments={manualTreatments}
                  onChange={setManualTreatments}
                />
              </div>
            )}

            <div className="pt-4 border-t border-zinc-800/80 space-y-6">
              <Textarea
                id="featured-treatments"
                label="Are there any treatments you especially want featured on the website?"
                explanation="For example: Traditional Thai Massage, Couples Massage, Hot Oil Massage, Deep Tissue Massage, Foot Massage, etc."
                placeholder="List your signature or most popular treatments..."
                value={featuredTreatments}
                onChange={(e) => setFeaturedTreatments(e.target.value)}
              />

              <RadioGroup
                label="How would you like prices shown on the website?"
                options={[
                  'Show all treatments, durations and prices',
                  'Show main treatments with starting prices',
                  'Do not show prices — customers will see them when booking',
                  "I'm not sure — choose what works best"
                ]}
                value={priceDisplay}
                onChange={setPriceDisplay}
              />

              <CheckboxGroup
                label="Do you offer any of these?"
                options={[
                  'Couples / Duo Massage',
                  'Gift Cards / Gift Vouchers',
                  'Packages',
                  'Memberships',
                  'Special Offers / Promotions',
                  'None',
                  'Other'
                ]}
                selectedValues={specialOffers}
                onChange={setSpecialOffers}
                allowExclusiveNone={true}
              />

              {specialOffers.includes('Other') && (
                <Input
                  id="other-special-offers"
                  label="Other Special Offers"
                  placeholder="e.g. Student discounts, Happy Hour, Birthday offers"
                  value={otherSpecialOffers}
                  onChange={(e) => setOtherSpecialOffers(e.target.value)}
                />
              )}

              {specialOffers.length > 0 && !specialOffers.includes('None') && (
                <Textarea
                  id="special-offers-details"
                  label="Please give us the details or provide a link where we can find them."
                  placeholder="Details, voucher links, package prices, promotion rules..."
                  value={specialOffersDetails}
                  onChange={(e) => setSpecialOffersDetails(e.target.value)}
                />
              )}
            </div>
          </Card>

          {/* SECTION 4 — BOOKING & CUSTOMER CONTACT */}
          <Card title="4. Booking & Customer Contact">
            <RadioGroup
              label="Do you currently use an online booking system?"
              options={['Fresha', 'Treatwell', 'Planity', 'Calendly', 'Another booking system', 'No online booking system']}
              value={bookingSystem}
              onChange={setBookingSystem}
              required
            />

            {bookingSystem === 'Another booking system' && (
              <Input
                id="booking-system-name"
                label="Booking System Name"
                placeholder="e.g. Mindbody, Booksy, Timely"
                value={bookingSystemName}
                onChange={(e) => setBookingSystemName(e.target.value)}
                required
              />
            )}

            {bookingSystem && bookingSystem !== 'No online booking system' && (
              <Input
                id="booking-page-link"
                label="Booking Page Link"
                placeholder="https://"
                explanation="Direct URL where clients book appointments."
                value={bookingPageLink}
                onChange={(e) => setBookingPageLink(e.target.value)}
                required
              />
            )}

            <CheckboxGroup
              label="How should customers be able to contact you?"
              options={['Online Booking', 'Phone Call', 'WhatsApp', 'Email', 'Contact Form', 'Instagram']}
              selectedValues={contactMethods}
              onChange={setContactMethods}
            />

            {contactMethods.includes('WhatsApp') && (
              <Input
                id="whatsapp-number"
                label="WhatsApp Number"
                placeholder="+33 6 12 34 56 78"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
            )}

            {contactMethods.includes('Email') && (
              <Input
                id="contact-email"
                label="Contact Email"
                placeholder="Leave blank to use Business Email, or enter a separate email"
                explanation="Uses the Business Email from Section 1 unless you provide another email here."
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            )}

            <Textarea
              id="pre-arrival-notice"
              label="Is there anything customers should know before booking or arriving?"
              explanation="For example: arrival instructions, cancellation policy, health considerations, building access, preparation before treatment, or anything else you normally tell customers."
              placeholder="e.g. Please arrive 5 minutes early, cash or card accepted, quiet atmosphere..."
              value={preArrivalNotice}
              onChange={(e) => setPreArrivalNotice(e.target.value)}
            />
          </Card>

          {/* SECTION 5 — BUSINESS & TEAM INFORMATION */}
          <Card title="5. Business & Team">
            <RadioGroup
              label="Would you like your massage therapists or team members shown on the website?"
              options={['Yes', 'No', 'Not sure']}
              value={showTeam}
              onChange={setShowTeam}
            />

            {showTeam === 'Yes' && (
              <div className="pt-2 border-t border-zinc-800/80">
                <RepeatableTeam
                  members={teamMembers}
                  onChange={setTeamMembers}
                />
              </div>
            )}

            <CheckboxGroup
              label="What languages can customers be served in?"
              options={['French', 'English', 'Thai', 'Other']}
              selectedValues={servedLanguages}
              onChange={setServedLanguages}
            />

            {servedLanguages.includes('Other') && (
              <Input
                id="other-served-languages"
                label="Other Languages Spoken"
                placeholder="e.g. Spanish, Russian, German"
                value={otherServedLanguages}
                onChange={(e) => setOtherServedLanguages(e.target.value)}
              />
            )}

            <Textarea
              id="special-techniques"
              label="Is there anything special about your massage techniques, therapists or business that you would like mentioned?"
              explanation="For example: authentic Thai techniques, therapist experience, certifications, atmosphere, special training, personalised treatments, etc."
              placeholder="e.g. Certified from the prestigious Wat Pho temple, traditional herbal oils, organic treatments..."
              value={specialTechniques}
              onChange={(e) => setSpecialTechniques(e.target.value)}
            />
          </Card>

          {/* SECTION 6 — PHOTOS & CONTENT */}
          <Card title="6. Photos & Content">
            <div className="space-y-6">
              <FileUpload
                label="Business Logo"
                accept="image/*,.pdf,.svg"
                explanation="Upload your high-resolution logo (optional)."
                files={fileState['Business Logo'] || []}
                onChange={(files) => handleFileChange('Business Logo', files)}
              />

              <PhotoGalleryUpload
                label="Salon / Studio Photos"
                explanation="Interior, massage rooms, reception, waiting area, relaxing atmosphere."
                files={fileState['Salon / Studio Photos'] || []}
                onChange={(files) => handleFileChange('Salon / Studio Photos', files)}
              />

              <PhotoGalleryUpload
                label="Massage / Treatment Photos"
                explanation="Treatments in action, massage tables, oils, hot stones, towels."
                files={fileState['Massage / Treatment Photos'] || []}
                onChange={(files) => handleFileChange('Massage / Treatment Photos', files)}
              />

              <PhotoGalleryUpload
                label="Therapist / Team Photos"
                explanation="Therapist portraits, team photos, uniform or working attire."
                files={fileState['Therapist / Team Photos'] || []}
                onChange={(files) => handleFileChange('Therapist / Team Photos', files)}
              />

              <PhotoGalleryUpload
                label="Exterior / Entrance Photos"
                explanation="Shopfront, building entrance, street view to help customers locate the salon."
                files={fileState['Exterior / Entrance Photos'] || []}
                onChange={(files) => handleFileChange('Exterior / Entrance Photos', files)}
              />

              <PhotoGalleryUpload
                label="Other Photos or Files"
                explanation="Brochures, price list flyers, certificates, decor details."
                files={fileState['Other Photos or Files'] || []}
                onChange={(files) => handleFileChange('Other Photos or Files', files)}
              />

              <Textarea
                id="photos-not-to-use"
                label="Are there any photos or materials that you do NOT want used on the website?"
                placeholder="e.g. Please do not use old photos showing former therapists or outdated decor."
                value={photosNotToUse}
                onChange={(e) => setPhotosNotToUse(e.target.value)}
              />
            </div>
          </Card>

          {/* SECTION 7 — ONLINE PROFILES */}
          <Card title="7. Online Profiles">
            <Input
              id="google-profile"
              label="Google Business Profile / Google Maps Link"
              placeholder="https://maps.google.com/..."
              value={googleProfileLink}
              onChange={(e) => setGoogleProfileLink(e.target.value)}
            />

            <Input
              id="instagram"
              label="Instagram"
              placeholder="https://instagram.com/yourprofile"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
            />

            <Input
              id="facebook"
              label="Facebook"
              placeholder="https://facebook.com/yourpage"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
            />

            <Input
              id="tiktok"
              label="TikTok"
              placeholder="https://tiktok.com/@youraccount"
              value={tiktokLink}
              onChange={(e) => setTiktokLink(e.target.value)}
            />

            <Input
              id="booking-profile"
              label="Booking Profile Link"
              placeholder="https://..."
              value={bookingProfileLink}
              onChange={(e) => setBookingProfileLink(e.target.value)}
            />

            <Input
              id="other-link"
              label="Other Important Link"
              placeholder="TripAdvisor, Yelp, or other directory link"
              value={otherLink}
              onChange={(e) => setOtherLink(e.target.value)}
            />
          </Card>

          {/* SECTION 8 — DOMAIN */}
          <Card title="8. Domain">
            <RadioGroup
              label="Do you already own a domain name for the business?"
              options={['Yes', 'No', 'Not sure']}
              value={domainOwned}
              onChange={setDomainOwned}
            />

            {domainOwned === 'Yes' && (
              <Input
                id="domain-name"
                label="Domain Name"
                placeholder="yourbusiness.fr"
                explanation="Example: yourbusiness.fr"
                required
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
            )}

            {domainOwned === 'No' && (
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-start space-x-3 text-sm text-zinc-300">
                <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p>
                  We will suggest suitable available domain names for you to choose from before the website is launched.
                </p>
              </div>
            )}
          </Card>

          {/* SECTION 9 — ADDITIONAL INFORMATION */}
          <Card title="9. Additional Information">
            <Textarea
              id="additional-info"
              label="Anything Else We Should Know?"
              explanation="If there is anything else you want included, avoided or considered for the website, tell us here."
              placeholder="Add anything important we should know before starting the website..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </Card>

          {/* PASSWORD SECURITY NOTICE */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-start space-x-3 text-xs text-zinc-400">
            <ShieldAlert className="w-5 h-5 text-amber-500/80 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-zinc-200">Security Note:</strong> Please do not send passwords through this form. If account access is required later, we will use the platform's official manager, collaborator or access-sharing system.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 sm:pt-8 pb-12 flex flex-col items-center space-y-6 border-t border-zinc-800/50">
            <label className="flex items-start space-x-3 cursor-pointer group w-full max-w-xl mx-auto p-3.5 sm:p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <input
                type="checkbox"
                required
                checked={confirmCheckbox}
                onChange={(e) => setConfirmCheckbox(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500/50 focus:ring-offset-zinc-950 mt-0.5 flex-shrink-0 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed select-none">
                I confirm that the information provided is correct and can be used to build my website and configure the business system. <span className="text-red-500">*</span>
              </span>
            </label>

            {submitState.isSubmitting && (
              <div className="flex flex-col items-center space-y-2 text-zinc-300 text-center px-4">
                <p className="text-xs sm:text-sm font-medium">{submitState.statusText}</p>
                {submitState.progressText && <p className="text-[11px] sm:text-xs text-zinc-500">{submitState.progressText}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={submitState.isSubmitting || !confirmCheckbox}
              className="px-8 py-3.5 sm:py-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-xl font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 w-full sm:w-auto min-w-[280px] justify-center shadow-lg shadow-red-900/20 active:scale-[0.99] min-h-[50px]"
            >
              {submitState.isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>SUBMITTING...</span>
                </>
              ) : (
                <span>SUBMIT INFORMATION</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
