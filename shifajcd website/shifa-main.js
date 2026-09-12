
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        if (hamburger && navLinks) hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Initialize Map (wrapped so a failed/blocked map-tile CDN never breaks the rest of the page's scripts)
        try {
            const map = L.map('map-container').setView([28.2835, 68.4388], 7); // Centered near Jacobabad

            // Map Layers (Street vs Satellite/Hybrid View)
            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; OpenStreetMap contributors'
            });

            const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            });

            streetLayer.addTo(map);

            const baseMaps = {
                "Map View": streetLayer,
                "Satellite View": satelliteLayer
            };

            L.control.layers(baseMaps).addTo(map);

            // Operational Markers with Details
            const locations = [
                { lat: 28.2835, lng: 68.4388, title: "<b>SHIFA Headquarters</b><br>Jacobabad, Sindh<br><i>Main Operating Hub & Women Empowerment Center</i>" },
                { lat: 27.5295, lng: 68.7592, title: "<b>Sindh Region Outreach</b><br>Khairpur & Sukkur Belts<br><i>Disaster Relief & Clean Water Initiatives</i>" },
                { lat: 28.4322, lng: 68.0371, title: "<b>Balochistan Outreach</b><br>Jaffarabad & Dera Allah Yar<br><i>Child Protection & Education Campaigns</i>" },
                { lat: 27.5598, lng: 68.2120, title: "<b>Larkana Operations</b><br>Sindh<br><i>Medical Camps & Legal Aid Support</i>" }
            ];

            locations.forEach(loc => {
                L.marker([loc.lat, loc.lng]).addTo(map).bindPopup(loc.title);
            });
        } catch (err) {
            console.warn('Map could not be initialized (tile/library service unavailable):', err);
        }


        // --- Projects Filter Logic ---
        const filterBtns = document.querySelectorAll('#projectFilterBar .filter-btn');
        const projectCards = document.querySelectorAll('#projectSlider .project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                projectCards.forEach(card => {
                    const cats = card.dataset.cat.split(' ');
                    if (filter === 'all' || cats.includes(filter)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });

                document.getElementById('projectSlider').scrollTo({ left: 0, behavior: 'smooth' });
            });
        });

        // --- Projects Slider Arrow Navigation ---
        const projSlider = document.getElementById('projectSlider');
        const scrollAmount = 370;

        document.getElementById('projNext')?.addEventListener('click', () => {
            projSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        document.getElementById('projPrev')?.addEventListener('click', () => {
            projSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // --- Gallery Highlights Filter Logic ---
        const galFilterBtns = document.querySelectorAll('#galleryFilterBar .filter-btn');
        const galItems = document.querySelectorAll('#gallerySlider .gallery-item');

        galFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                galFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                galItems.forEach(item => {
                    const cats = item.dataset.cat.split(' ');
                    if (filter === 'all' || cats.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });

                document.getElementById('gallerySlider').scrollTo({ left: 0, behavior: 'smooth' });
            });
        });

        // --- Gallery Slider Arrow Navigation ---
        const gallerySlider = document.getElementById('gallerySlider');
        document.getElementById('galNext')?.addEventListener('click', () => {
            gallerySlider.scrollBy({ left: 320, behavior: 'smooth' });
        });
        document.getElementById('galPrev')?.addEventListener('click', () => {
            gallerySlider.scrollBy({ left: -320, behavior: 'smooth' });
        });

        // --- Success Stories Slider Arrow Navigation ---
        const storiesSlider = document.getElementById('storiesSlider');
        document.getElementById('storiesNext')?.addEventListener('click', () => {
            storiesSlider.scrollBy({ left: 384, behavior: 'smooth' });
        });
        document.getElementById('storiesPrev')?.addEventListener('click', () => {
            storiesSlider.scrollBy({ left: -384, behavior: 'smooth' });
        });

        // --- Youth Champions Slider Arrow Navigation ---
        const youthSlider = document.getElementById('youthSlider');
        document.getElementById('youthNext')?.addEventListener('click', () => {
            youthSlider.scrollBy({ left: 292, behavior: 'smooth' });
        });
        document.getElementById('youthPrev')?.addEventListener('click', () => {
            youthSlider.scrollBy({ left: -292, behavior: 'smooth' });
        });

        // --- Volunteer & Contact Forms: submit directly to SHIFA's email (no page reload) ---
        document.querySelectorAll('.ajax-form').forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const endpoint = form.dataset.endpoint;
                const statusEl = form.querySelector('.form-status');
                const btn = form.querySelector('button[type="submit"]');
                const originalBtnText = btn.textContent;

                statusEl.textContent = 'Sending...';
                statusEl.className = 'form-status loading';
                btn.disabled = true;

                fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form)
                })
                    .then(res => res.json().then(data => ({ ok: res.ok, data })))
                    .then(({ ok }) => {
                        if (ok) {
                            statusEl.textContent = 'Thank you! Your message has been sent to SHIFA.';
                            statusEl.className = 'form-status success';
                            form.reset();
                        } else {
                            throw new Error('Submission failed');
                        }
                    })
                    .catch(() => {
                        statusEl.textContent = 'Could not send right now. Please email us directly at shifa.jcd@gmail.com.';
                        statusEl.className = 'form-status error';
                    })
                    .finally(() => {
                        btn.disabled = false;
                        btn.textContent = originalBtnText;
                    });
            });
        });


        // --- Achievement & Media Highlight Details ---
        (function () {
            const highlightDescriptions = ["Participated in the National Workshop – Pakistan Localization Lab of NEAR Network Members held on 14–15 January 2025 in Islamabad. The workshop fostered dialogue on advancing localization, strengthening local capacities, and building equitable partnerships for effective, locally led humanitarian and development responses.", "On 27 January 2025, SHIFA organized a Youth Strategic Workshop under the Grassroots Actions to End CEFM project, bringing together Youth Champions, mentors, and key stakeholders. The workshop focused on identifying root causes of CEFM and developing youth-led, practical strategies for advocacy, awareness, and community action.", "SHIFA team successfully resolved a vulnerable woman's property rights case through Alternative Dispute Resolution (ADR). By ensuring fair and peaceful solutions, we continue to empower marginalized communities and uphold justice for all. Together, we strive for a more just and inclusive society!", "Strengthening Commitments for Child Rights & Anti-Human Trafficking: On 30 January 2025, a monthly review meeting was held at the DC Office, chaired by Deputy Commissioner Sameer Leghari, focusing on child rights, anti-human trafficking, and bonded labor. Representatives from FIA, Social Welfare, Child Protection, and Police discussed joint strategies to protect vulnerable communities and strengthen justice mechanisms.", "May this Holi 2025 bring joy, harmony, and new hope into your life, spreading love beyond all boundaries and strengthening the spirit of unity and coexistence.", "Participated in the Consultation Dialogue for the Support to Civil Society in Pakistan (SCSP) Project at AVARI Hotel, Karachi.  Co-financed by the EU and Germany and implemented by GIZ under the Participatory Local Governance Program, the dialogue focused on strengthening inclusive democracy, transparency, and citizen engagement in governance.", "Anticipatory Action for #Heatwave2025: In District Jaffarabad, Baluchistan, SHIFA coordinated with the District Health Officer and Deputy DHO to implement the Heat wave Anticipatory Action 2025. Supported by ACTED Pakistan, Start Network, and Ready Pakistan, the initiative includes training health providers, activating the District Heat wave Response Group, strengthening early warning systems, and establishing four cooling centers at high-risk health facilities.", "SHIFA Welfare Association and ACTED Pakistan held a joint meeting with the District Health Department Jaffarabad and conducted a field visit with ADHO Mr. Naeem Bugti and MS DHQ Hospital. Preparations are underway to establish Cooling Centers under the Heatwave Anticipatory Action 2025 initiative to protect vulnerable communities from extreme heat, supported by ACTED Pakistan, Start Network, and Ready Pakistan.", "SHIFA conducted Heatwave Preparedness & Response Training for frontline healthcare providers in Jaffarabad as part of #Heatwave2025, supported by ACTED Pakistan, Start Network, and Ready Pakistan. The training, coordinated with DHO Mr. Ayaz Jamali and Deputy DHO Dr. Naeem Bugti, aimed to protect at-risk communities. SHIFA continues to strengthen systems, raise awareness, and save lives ahead of extreme heat events.", "SHIFA successfully conducted Heatwave Preparedness & Response Training for frontline healthcare providers and BHU staff in Jaffarabad under #Heatwave2025, supported by ACTED Pakistan, Start Network, and Ready Pakistan. Coordinated with DHO Mr. Ayaz Jamali and Deputy DHO Dr. Naeem Bugti, the training aimed to protect at-risk communities from extreme heat. SHIFA continues to strengthen systems, raise awareness, and safeguard lives.", "SHIFA organized a Youth Co-Creation Activity where young leaders showcased their initiatives to end Child, Early, and Forced Marriages (CEFM) through theater, art, and speeches. Students from three government secondary schools actively participated, raising their voices and presenting creative solutions for safer communities.", "SHIFA organized a Youth Co-Creation Activity where young leaders showcased their initiatives to end Child, Early, and Forced Marriages (CEFM) through theater, art, and speeches. Students from three government secondary schools participated, sharing creative solutions and raising their voices for a safer future.", "Strengthening Heatwave Preparedness in Jaffarabad, SHIFA, in collaboration with the District Administration, officially established the District Heatwave Response Group (DHRG) under Deputy Commissioner Mr. Azhar Shehzad’s directives. The DHRG will focus on preparedness, early warning, and coordinated emergency response, with participation from key government departments, humanitarian organizations, and local stakeholders.", "SHIFA inaugurated a Cooling Center in District Jaffarabad under the “Anticipatory Action for Heatwave 2025” initiative, supported by ACTED Pakistan, Start Network, and Ready Pakistan. Handed over to DHO Dr. Ayaz Jamali and MS Dr. Rafique, the center strengthens community preparedness, resilience, and response to extreme heat.", "SHIFA conducted an Induction Session under the Pakistan Youth Leadership Initiative (PYLI) to launch Youth-Led Climate Actions (YLAs). Youth groups will design and implement community-based projects in areas like tree plantation, water conservation, waste management, renewable energy, and climate education, fostering leadership and climate resilience.", "SHIFA, under the “Anticipatory Action for Heatwave 2025” initiative, established three new Cooling Centers in District Jaffarabad at RHC Rojhan Jamali, BHU Cattle Farm, and BHU Allah Yar Khoso. Supported by ACTED Pakistan, Start Network, and Ready Pakistan, these centers were handed over to DHO Dr. Ayaz Jamali, strengthening community preparedness, resilience, and climate response.", "Empowering Youth for Climate Action! SHIFA organized a 4-day Leadership Training under PYLI, training 35 young leaders to drive climate action in their communities. So far, 220 youth have been trained, fostering sustainability, resilience, and environmental justice, with support from the British Council.", "SHIFA and Peace & Justice Network (PJN) participated in the “Collaboration for Impact: A National Meet” organized by GIZ at Marriott Hotel, Islamabad. Held under the Support to Civil Society in Pakistan initiative (PLG Program), the event brought together civil society, community leaders, and policymakers to strengthen inclusive and participatory governance.", "SHIFA organized community-led sessions to promote clean water, sanitation, and hygiene, empowering people to protect their right to safe water. Supported by End Water Poverty, the initiative fosters healthier, more resilient communities.", "SHIFA organized the 2nd round of Youth-Led Advocacy Campaigns and a Youth Strategic Development Workshop across 5 Union Councils in Jacobabad to end Child, Early, and Forced Marriages (CEFM). Youth champions led awareness sessions, engaged communities, and worked with stakeholders to challenge harmful norms, fostering a safer and empowered generation.", "SHIFA organized a One-Day Youth Strategic Development Workshop to tackle Child, Early, and Forced Marriages (CEFM), empowering young leaders to plan and lead change. Together with youth champions and partners, we are building a safer, more informed and empowered generation.", "Empowering Youth for Climate Action! SHIFA completed the 2nd 4-day Leadership Training under PYLI, equipping young leaders with skills and confidence to drive climate action in their communities. Supported by the British Council, the initiative fosters a green, sustainable, and resilient future.", "SHIFA organized a Multi-Stakeholder Dialogue in Jacobabad on water governance, chaired by ADC-I Mr. Zarar Abbas, with participation from government departments, civil society, and INGOs. The session led to the formation of the District Water Governance Group, the first official committee to improve coordination, accountability, and access to safe water, supported by End Water Poverty.", "Alhamdulillah! SHIFA, alongside SPO, Save the Children Pakistan, and partner organizations, participated in the Grand Provincial Advocacy Event at Arts Council Karachi to raise a collective voice against child marriage in Sindh. The event promoted dialogue, commitment, and action to protect children’s futures.", "Youth Leading for a Greener Future! SHIFA, along with PYLI Youth Champions, inaugurated a Youth-Led Tree Plantation Drive in Jacobabad, supported by the British Council Pakistan. We thank Deputy Commissioner Nawab Sumair Leghari, AC Abu Bakar Sadhyio, and school leaders for partnering in this mission toward a cleaner, greener, and safer future.", "Community Voices Take the Stage! SHIFA organized 5 community-level theater performances in Tehsil Jacobabad, reaching over 1,200 people to raise awareness on Child, Early, and Forced Marriages (CEFM). The initiative engaged community members and leaders, sparking dialogue and promoting action to protect children’s rights.", "Strengthening Legal Response to Gender-Based Violence, The SHIFA Welfare Association - SHIFA successfully conducted a Follow-up Training on Violence against Women (VAW) Laws for lawyers under the Justice Support Program, funded by The Asia Foundation in collaboration with IRI and CPDI.  The session aimed to:  Reinforce understanding of VAW laws Strengthen legal aid mechanisms Promote gender-sensitive justice delivery Together; we are building a stronger, more responsive justice system that upholds the rights of women and girls.", "Youth Leading the Way for Climate Action! SHIFA conducted a 4-day Youth Leadership Training Workshop under PYLI, in partnership with the British Council Pakistan, to build youth capacities on climate awareness, leadership, and collective action. Supported by partner organizations, the initiative empowers young leaders to drive sustainable, community-led climate solutions.", "Youth Power, Climate Power! SHIFA successfully completed a 4-day Youth Leadership Training Workshop on Climate Action with the British Council, empowering young change makers to lead climate awareness, advocacy, and collective action for a greener future. The PYLI project, supported by multiple partners, builds youth leadership for sustainable, community-driven climate solutions.", "Youth Leading for a Greener Future! 🌱 SHIFA, together with #PYLI Youth Champions, inaugurated a Youth-Led Tree Plantation Drive at Jacobabad Paramedical Institute, supported by the British Council Pakistan. This campaign promotes climate action and community engagement, fostering a cleaner, greener, and safer future.", "Youth Taking the Lead in Waste Management! SHIFA’s dedicated youth under PYLI successfully conducted a Waste Management Activity at Benazir Public Family Park, Jacobabad, raising awareness on cleanliness, environmental responsibility, and community well-being. Supported by the British Council, this initiative fosters a cleaner, greener, and healthier Jacobabad.", "SHIFA successfully conducted a Follow-up Training for Jirga Community Members under the Justice Support Program, supported by CPDI and funded by The Asia Foundation. The training strengthened local justice mechanisms and promoted community-based conflict resolution.", "Celebrating Youth Leadership for Water Conservation! SHIFA’s Youth Champions under the YLA program in Jacobabad promoted wise use of water for kitchen gardening, household needs, and laundry. Supported by the British Council, their efforts showcase responsibility, sustainability, and community care.", "Youth Power Climate Power! SHIFA successfully concluded a 4-day Youth Leadership Training Workshop on Climate Action with the British Council, empowering young change makers to lead climate awareness, advocacy, and collective action for a greener, safer future. The PYLI project, supported by multiple partners, fosters youth leadership for sustainable, community-driven climate solutions.", "SHIFA successfully conducted a 4-day Youth Leadership Workshop on Climate Action in Jacobabad under the Pakistan Youth Leadership Initiative (PYLI). The three-year PYLI project, led by the British Council Pakistan and partners, aims to train 90,000 youth nationwide in leadership, Global Citizenship Education, and climate action.", "SHIFA successfully conducted the 7th Batch 4-day Youth Leadership Workshop on Climate Action under the Pakistan Youth Leadership Initiative (PYLI). This three-year project, led by the British Council Pakistan and partners, aims to train 90,000 youth nationwide in leadership, Global Citizenship Education, and climate action.", "SHIFA Youth Champions in Action! Under PYLI, SHIFA youth led Solid Waste Management initiatives across Jacobabad and Tree Plantation Campaigns at schools and Shaheen Vocational Training Institute. The three-year PYLI project, led by the British Council and partners, empowers youth nationwide in leadership, Global Citizenship Education, and climate action for a cleaner, greener future.", "SHIFA successfully conducted a Community Learning Platform with teachers, health professionals, and youth leaders under the Justice Sector Support Program for Women. Funded by The Asia Foundation and supported by CPDI, the initiative strengthens community engagement, awareness, and leadership to promote women’s access to justice.", "SHIFA Youth Champions, under the Pakistan Youth Leadership for Water Conservation (YLI) program, promoted sustainable water use in Jacobabad through practices like kitchen gardening and household water reuse. Supported by the British Council, their efforts set a strong example of youth-led responsibility, sustainability, and community care.", "SHIFA successfully conducted a one-day follow-up training for Prosecutors on Violence against Women (VAW) in Jacobabad under the Justice Sector Support Program. Funded by The Asia Foundation and supported by CPDI, the session strengthened legal capacities with participation from district prosecutors and assistant prosecutors, fostering more effective gender-sensitive justice delivery.", "SHIFA held a productive meeting with SSP Mr. Muhammad Kaleem Malik to discuss ongoing Justice Sector Support Program initiatives, including follow-up training for police on Violence Against Women (VAW). Funded by The Asia Foundation and supported by CPDI, the session highlighted efforts to strengthen justice reforms and promote gender-sensitive policing.", "SHIFA proudly presents Youth Leaders Actions (YLAs) on Renewable Energy, empowering youth to lead sustainable, climate-friendly solutions in their communities. Under the three-year PYLI project led by the British Council Pakistan and partners, 90,000 youth nationwide are being trained in leadership, Global Citizenship Education, and Climate Action.", "SHIFA distributed 100 Clean Water Filter Units in Village Abdul Aziz, addressing the critical Hepatitis B & C risk caused by unsafe drinking water. Supported by One Vision Research Society Pakistan, this initiative provides safe water to improve health and prevent disease, making a difference one drop at a time.", "SHIFA successfully organized an Innovative Community Learning Platform at Jacobabad Paramedical Institute, engaging 31 participants (19 females, 12 males). Conducted under the Justice Sector Support Program and supported by The Asia Foundation and CPDI, the session empowered communities through learning, dialogue, and innovation.", "SHIFA conducted an MLAC session at Girls High School Jacobabad, engaging 51 girls in an empowering learning experience. Organized under the Justice Sector Support Program for Women, funded by The Asia Foundation and supported by CPDI, the session promotes knowledge, confidence, and access to justice for a brighter, inclusive future.", "SHIFA, under the Pakistan Youth Leadership Initiative funded by the British Council, organized a Youth-Led Actions Showcasing Event in Jacobabad. Youth champions presented innovative projects on social, educational, and environmental issues, while a panel on Climate Education sparked dialogue on eco-friendly practices and community leadership. Top projects were recognized with certificates and shields, celebrating youth creativity and leadership.", "SHIFA successfully organized a One-Day Youth Strategic Development Workshop to tackle Child, Early, and Forced Marriages (CEFM), empowering young leaders to plan and lead change. Thanks to our youth champions and partners—including British Council Pakistan, UNODC, Save the Children, SPO, Child Fund, UNESCO, Youth New Zealand, and GIZ—for supporting child rights and protection.", "SHIFA proudly celebrated a joint Christmas event with the Christian community at District Council Hall, Jacobabad, promoting unity, peace, and interfaith harmony. Honored by Assistant Commissioner Mr. Naveed Ahmed, the inclusive gathering brought together diverse religious, ethnic, and community representatives, showcasing SHIFA’s commitment to tolerance, social cohesion, and celebrating diversity as strength.", "SHIFA Welfare Association distributed Winterization Kits among the ethnic minority Hindu Scheduled Caste Bheel community, one of the most vulnerable and marginalized groups in the area. During a needs assessment, SHIFA identified that families were living without proper shelter amid ongoing rainfall, exposing them to harsh weather and serious risks. Responding to this urgent humanitarian need, SHIFA provided timely winterization support with the generous assistance of NEAR Change Funds, reflecting its continued commitment to humanitarian assistance, dignity, and the inclusion of marginalized and at-risk communities.", "SHIFA Welfare Association (SHIFA) has officially signed a Memorandum of Understanding (MoU) with Elite Academy Jacobabad to provide Web Design & Development and IT training to female students in Jacobabad. This partnership aims to enhance digital skills, education, and youth empowerment, marking a meaningful step toward inclusive learning and a brighter future for local youth.", "A small dream that began 10 years ago has reached a proud milestone. The journey of SHIFA Welfare Association was filled with challenges, but today we stand stronger than ever. Yesterday’s surprise celebration by the SHIFA team was a beautiful moment of gratitude and reflection. Over the past decade, SHIFA has completed 26 projects (humanitarian response, legal reform, inclusion, and governance), conducted 10 research studies, led 8 evaluations, built 40 national and international alliances, and expanded from Jacobabad to Sindh, Balochistan.", "On behalf of SHIFA Welfare Association, we extend our sincere gratitude to all PLF members for their trust in electing Mr. Gul Buledi (Executive Director, SHIFA) as Secretary PLF Sindh and Mr. Khadim Dahoot as Convener. Together with our partners and allies, we remain committed to protecting children’s rights and building a future free from forced and early marriages."];

            const overlay = document.getElementById('highlightModalOverlay');
            const closeBtn = document.getElementById('highlightModalClose');
            const imageEl = document.getElementById('highlightModalImage');
            const titleEl = document.getElementById('highlightModalTitle');
            const tagEl = document.getElementById('highlightModalTag');
            const descriptionEl = document.getElementById('highlightModalDescription');
            const highlightItems = document.querySelectorAll('#gallerySlider .gallery-item');

            function closeHighlightModal() {
                overlay.classList.remove('active');
                document.body.classList.remove('highlight-modal-open');
            }

            highlightItems.forEach((item) => {
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');

                const openHighlight = () => {
                    const index = Number(item.dataset.highlightId);
                    const image = item.querySelector('img');
                    const title = item.querySelector('h4');
                    const tag = item.querySelector('.gallery-tag');

                    if (!highlightDescriptions[index]) return;

                    titleEl.textContent = title ? title.textContent.trim() : 'SHIFA Highlight';
                    tagEl.textContent = tag ? tag.textContent.trim() : 'Impact Highlight';
                    descriptionEl.textContent = highlightDescriptions[index];

                    if (image) {
                        imageEl.src = image.currentSrc || image.src;
                        imageEl.alt = image.alt || titleEl.textContent;
                    }

                    overlay.classList.add('active');
                    document.body.classList.add('highlight-modal-open');
                    closeBtn.focus();
                };

                item.addEventListener('click', openHighlight);
                item.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openHighlight();
                    }
                });
            });

            closeBtn?.addEventListener('click', closeHighlightModal);
            overlay?.addEventListener('click', (event) => {
                if (event.target === overlay) closeHighlightModal();
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && overlay.classList.contains('active')) {
                    closeHighlightModal();
                }
            });
        })();

        // --- Project Gallery Modal & Carousel ---
        (function () {
            const overlay = document.getElementById('projectModalOverlay');
            const closeBtn = document.getElementById('projectModalClose');
            const titleEl = document.getElementById('projectModalTitle');
            const track = document.getElementById('carouselTrack');
            const prevBtn = document.getElementById('carouselPrev');
            const nextBtn = document.getElementById('carouselNext');
            const counterEl = document.getElementById('carouselCounter');
            const dotsEl = document.getElementById('carouselDots');

            // Placeholder shown until real project photos are uploaded to the paths in each card's data-images
            const FALLBACK_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="440" viewBox="0 0 700 440">' +
                '<rect width="700" height="440" fill="#1e293b"/>' +
                '<g fill="#64748b" font-family="sans-serif" text-anchor="middle">' +
                '<text x="350" y="210" font-size="20" font-weight="700">Photo coming soon</text>' +
                '<text x="350" y="238" font-size="13">Add project images to enable this gallery</text>' +
                '</g></svg>'
            );

            let slides = [];
            let current = 0;

            function renderSlides(images, title) {
                titleEl.textContent = title;
                track.innerHTML = '';
                dotsEl.innerHTML = '';
                images.forEach((src, i) => {
                    const slide = document.createElement('div');
                    slide.className = 'carousel-slide';
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = title + ' — photo ' + (i + 1);
                    img.loading = 'lazy';
                    img.onerror = function () { this.onerror = null; this.src = FALLBACK_IMG; };
                    slide.appendChild(img);
                    track.appendChild(slide);

                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
                    dot.addEventListener('click', () => goTo(i));
                    dotsEl.appendChild(dot);
                });
                slides = Array.from(track.children);
                current = 0;
                updateCarousel();
            }

            function updateCarousel() {
                track.style.transform = `translateX(-${current * 100}%)`;
                counterEl.textContent = (current + 1) + ' / ' + slides.length;
                dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
                    d.classList.toggle('active', i === current);
                });
            }

            function goTo(index) {
                if (!slides.length) return;
                current = (index + slides.length) % slides.length;
                updateCarousel();
            }

            function openModal(images, title) {
                renderSlides(images, title);
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            prevBtn?.addEventListener('click', () => goTo(current - 1));
            nextBtn?.addEventListener('click', () => goTo(current + 1));
            closeBtn?.addEventListener('click', closeModal);

            overlay?.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal();
            });

            document.addEventListener('keydown', (e) => {
                if (!overlay.classList.contains('active')) return;
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowRight') goTo(current + 1);
                if (e.key === 'ArrowLeft') goTo(current - 1);
            });

            // Swipe support for touch/mobile scrolling through the carousel
            let touchStartX = 0;
            const carouselEl = document.getElementById('projectCarousel');
            carouselEl?.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
            }, { passive: true });
            carouselEl.addEventListener('touchend', (e) => {
                const diff = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(diff) > 40) {
                    diff < 0 ? goTo(current + 1) : goTo(current - 1);
                }
            }, { passive: true });

            // Wire up every project card to open the gallery on click
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('click', () => {
                    const images = (card.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
                    const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Project Gallery';
                    if (images.length) openModal(images, title);
                });
            });
        })();
    