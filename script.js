class SEOAuditTool {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.formData = {};
    }

    initializeElements() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabPanels = document.querySelectorAll('.tab-panel');
        this.generateReportBtn = document.getElementById('generateReport');
        this.printReportBtn = document.getElementById('printReport');
        this.auditReport = document.getElementById('auditReport');
        this.reportPlaceholder = document.getElementById('reportPlaceholder');
        this.formInputs = document.querySelectorAll('input, select, textarea');
    }

    attachEventListeners() {
        // Tab navigation
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form validation
        this.formInputs.forEach(input => {
            input.addEventListener('change', () => this.validateForm());
        });

        // Report generation
        this.generateReportBtn.addEventListener('click', () => this.generateReport());
        this.printReportBtn.addEventListener('click', () => this.printReport());
    }

    switchTab(tabName) {
        // Update active tab button
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab panel
        this.tabPanels.forEach(panel => panel.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
    }

    validateForm() {
        const requiredFields = [
            'clientName', 'websiteUrl', 'industry', 'primaryKeywords'
        ];
        
        const isValid = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim() !== '';
        });

        this.generateReportBtn.disabled = !isValid;
    }

    collectFormData() {
        this.formData = {};
        this.formInputs.forEach(input => {
            this.formData[input.id] = input.value;
        });
    }

    calculateScores() {
        const scores = {
            technical: this.calculateTechnicalScore(),
            onPage: this.calculateOnPageScore(),
            content: this.calculateContentScore(),
            overall: 0
        };

        scores.overall = Math.round((scores.technical + scores.onPage + scores.content) / 3);
        return scores;
    }

    calculateTechnicalScore() {
        let score = 100;
        
        // Page load speed scoring
        const speed = parseFloat(this.formData.pageLoadSpeed) || 0;
        if (speed > 3) score -= 20;
        else if (speed > 2) score -= 10;
        
        // Mobile responsive scoring
        const mobile = this.formData.mobileResponsive;
        if (mobile === 'poor') score -= 25;
        else if (mobile === 'fair') score -= 15;
        else if (mobile === 'good') score -= 5;
        
        // SSL Certificate
        if (this.formData.sslCertificate === 'no') score -= 15;
        
        // XML Sitemap
        const sitemap = this.formData.xmlSitemap;
        if (sitemap === 'missing') score -= 15;
        else if (sitemap === 'outdated') score -= 8;
        
        // Core Web Vitals
        const cwv = parseInt(this.formData.coreWebVitals) || 0;
        if (cwv < 50) score -= 20;
        else if (cwv < 75) score -= 10;
        
        return Math.max(0, Math.min(100, score));
    }

    calculateOnPageScore() {
        let score = 100;
        const factors = [
            'titleTags', 'metaDescriptions', 'headerTags', 
            'keywordOptimization', 'imageOptimization', 'internalLinking'
        ];
        
        factors.forEach(factor => {
            const value = this.formData[factor];
            if (value === 'poor') score -= 15;
            else if (value === 'fair') score -= 10;
            else if (value === 'good') score -= 5;
        });
        
        return Math.max(0, Math.min(100, score));
    }

    calculateContentScore() {
        let score = 100;
        const factors = [
            'contentQuality', 'contentLength', 'contentFreshness', 'keywordDensity'
        ];
        
        factors.forEach(factor => {
            const value = this.formData[factor];
            if (value === 'poor') score -= 20;
            else if (value === 'fair') score -= 12;
            else if (value === 'good') score -= 5;
        });
        
        // Readability bonus/penalty
        const readability = parseInt(this.formData.readabilityScore) || 0;
        if (readability < 60) score -= 10;
        else if (readability > 80) score += 5;
        
        return Math.max(0, Math.min(100, score));
    }

    getScoreColor(score) {
        if (score >= 80) return '#48bb78';
        if (score >= 60) return '#38b2ac';
        if (score >= 40) return '#ecc94b';
        return '#f56565';
    }

    getScoreGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B+';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        return 'F';
    }

    generateFindings() {
        const findings = {
            technical: [],
            onPage: [],
            content: [],
            recommendations: []
        };

        // Technical SEO findings
        if (this.formData.pageLoadSpeed && parseFloat(this.formData.pageLoadSpeed) > 3) {
            findings.technical.push({
                title: 'Page Load Speed Issues',
                description: `Website loads in ${this.formData.pageLoadSpeed} seconds. Recommended load time is under 3 seconds.`,
                severity: 'poor'
            });
            findings.recommendations.push({
                title: 'Optimize Page Load Speed',
                description: 'Implement image optimization, enable compression, and leverage browser caching.',
                priority: 'high'
            });
        }

        if (this.formData.sslCertificate === 'no') {
            findings.technical.push({
                title: 'Missing SSL Certificate',
                description: 'Website is not secured with HTTPS. This affects both security and SEO rankings.',
                severity: 'poor'
            });
            findings.recommendations.push({
                title: 'Install SSL Certificate',
                description: 'Obtain and install an SSL certificate to enable HTTPS.',
                priority: 'high'
            });
        }

        if (this.formData.mobileResponsive === 'poor' || this.formData.mobileResponsive === 'fair') {
            findings.technical.push({
                title: 'Mobile Responsiveness Issues',
                description: 'Website has mobile compatibility issues affecting user experience.',
                severity: this.formData.mobileResponsive
            });
            findings.recommendations.push({
                title: 'Improve Mobile Experience',
                description: 'Implement responsive design to ensure optimal mobile user experience.',
                priority: 'high'
            });
        }

        // On-Page SEO findings
        if (this.formData.titleTags === 'poor' || this.formData.titleTags === 'fair') {
            findings.onPage.push({
                title: 'Title Tag Optimization Needed',
                description: 'Title tags require optimization for better search engine visibility.',
                severity: this.formData.titleTags
            });
            findings.recommendations.push({
                title: 'Optimize Title Tags',
                description: 'Create unique, descriptive title tags for each page including primary keywords.',
                priority: 'high'
            });
        }

        if (this.formData.metaDescriptions === 'poor' || this.formData.metaDescriptions === 'fair') {
            findings.onPage.push({
                title: 'Meta Description Issues',
                description: 'Meta descriptions are missing or poorly optimized.',
                severity: this.formData.metaDescriptions
            });
            findings.recommendations.push({
                title: 'Write Compelling Meta Descriptions',
                description: 'Create unique meta descriptions for each page to improve click-through rates.',
                priority: 'medium'
            });
        }

        // Content findings
        if (this.formData.contentQuality === 'poor' || this.formData.contentQuality === 'fair') {
            findings.content.push({
                title: 'Content Quality Concerns',
                description: 'Website content needs improvement to provide better value to users.',
                severity: this.formData.contentQuality
            });
            findings.recommendations.push({
                title: 'Enhance Content Quality',
                description: 'Create high-value, comprehensive content that addresses user needs.',
                priority: 'high'
            });
        }

        if (this.formData.contentLength === 'poor') {
            findings.content.push({
                title: 'Thin Content Issues',
                description: 'Many pages have insufficient content length for effective SEO.',
                severity: 'poor'
            });
            findings.recommendations.push({
                title: 'Expand Content Length',
                description: 'Develop comprehensive content with at least 500-1000 words per page.',
                priority: 'medium'
            });
        }

        return findings;
    }

    generateReport() {
        this.collectFormData();
        const scores = this.calculateScores();
        const findings = this.generateFindings();
        
        const reportHTML = this.createReportHTML(scores, findings);
        
        this.auditReport.innerHTML = reportHTML;
        this.auditReport.style.display = 'block';
        this.reportPlaceholder.style.display = 'none';
        this.printReportBtn.disabled = false;
        
        // Switch to report tab
        this.switchTab('report');
    }

    createReportHTML(scores, findings) {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="report-header">
                <h1 class="report-title">SEO AUDIT REPORT</h1>
                <div class="report-subtitle">Comprehensive SEO Analysis for ${this.formData.clientName}</div>
                <div class="report-date">Generated on ${currentDate} by Empire Digisol</div>
            </div>
            
            <div class="report-content">
                <div class="score-overview">
                    <div class="score-card">
                        <div class="score-number" style="color: ${this.getScoreColor(scores.overall)}">${scores.overall}</div>
                        <div class="score-label">Overall Score</div>
                        <div class="score-description">Grade: ${this.getScoreGrade(scores.overall)}</div>
                    </div>
                    <div class="score-card">
                        <div class="score-number" style="color: ${this.getScoreColor(scores.technical)}">${scores.technical}</div>
                        <div class="score-label">Technical SEO</div>
                        <div class="score-description">Site Performance</div>
                    </div>
                    <div class="score-card">
                        <div class="score-number" style="color: ${this.getScoreColor(scores.onPage)}">${scores.onPage}</div>
                        <div class="score-label">On-Page SEO</div>
                        <div class="score-description">Content Optimization</div>
                    </div>
                    <div class="score-card">
                        <div class="score-number" style="color: ${this.getScoreColor(scores.content)}">${scores.content}</div>
                        <div class="score-label">Content Quality</div>
                        <div class="score-description">User Value</div>
                    </div>
                </div>

                ${this.createExecutiveSummary(scores)}
                ${this.createFindingsSection('Technical SEO Analysis', findings.technical)}
                ${this.createFindingsSection('On-Page SEO Analysis', findings.onPage)}
                ${this.createFindingsSection('Content Analysis', findings.content)}
                ${this.createRecommendationsSection(findings.recommendations)}
                ${this.createCompetitorAnalysis()}
                ${this.createNextSteps()}
                ${this.createCTASection()}
            </div>
        `;
    }

    createExecutiveSummary(scores) {
        let summaryText = '';
        
        if (scores.overall >= 80) {
            summaryText = 'Excellent performance across all SEO metrics. The website demonstrates strong technical foundation and content optimization with minor areas for enhancement.';
        } else if (scores.overall >= 60) {
            summaryText = 'Good overall performance with solid foundations in place. Several opportunities for improvement have been identified that could significantly boost search engine visibility.';
        } else if (scores.overall >= 40) {
            summaryText = 'Moderate performance with considerable room for improvement. Addressing the identified issues will lead to substantial gains in search engine rankings and organic traffic.';
        } else {
            summaryText = 'Significant opportunities for improvement across multiple SEO factors. Implementing our recommendations will dramatically improve search engine visibility and organic traffic potential.';
        }

        return `
            <div class="section">
                <h3>Executive Summary</h3>
                <p><strong>Website:</strong> ${this.formData.websiteUrl || 'N/A'}</p>
                <p><strong>Industry:</strong> ${this.formData.industry || 'N/A'}</p>
                <p><strong>Target Location:</strong> ${this.formData.targetLocation || 'N/A'}</p>
                <p><strong>Primary Keywords:</strong> ${this.formData.primaryKeywords || 'N/A'}</p>
                <br>
                <p>${summaryText}</p>
                <p>This comprehensive audit has identified key areas for optimization that will enhance your website's search engine performance, user experience, and overall digital presence.</p>
            </div>
        `;
    }

    createFindingsSection(title, findings) {
        if (findings.length === 0) {
            return `
                <div class="section">
                    <h3>${title}</h3>
                    <ul class="findings-list">
                        <li class="excellent">
                            <div class="finding-title">Excellent Performance Detected</div>
                            <div class="finding-description">This section demonstrates strong optimization with no critical issues identified. Continue current best practices to maintain this high standard.</div>
                        </li>
                    </ul>
                </div>
            `;
        }

        const findingsHTML = findings.map(finding => `
            <li class="${finding.severity}">
                <div class="finding-title">${finding.title}</div>
                <div class="finding-description">${finding.description}</div>
            </li>
        `).join('');

        return `
            <div class="section">
                <h3>${title}</h3>
                <ul class="findings-list">
                    ${findingsHTML}
                </ul>
            </div>
        `;
    }

    createRecommendationsSection(recommendations) {
        if (recommendations.length === 0) {
            recommendations = [
                {
                    title: 'Maintain Current Excellence',
                    description: 'Your website shows strong SEO performance. Continue monitoring and maintaining current best practices while staying updated with the latest SEO trends and algorithm changes.',
                    priority: 'low'
                },
                {
                    title: 'Regular SEO Health Checks',
                    description: 'Schedule quarterly SEO audits to ensure continued optimization and catch any emerging issues early.',
                    priority: 'medium'
                }
            ];
        }

        const recommendationsHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="priority ${rec.priority}">${rec.priority.toUpperCase()} PRIORITY</div>
                <div class="finding-title">${rec.title}</div>
                <div class="finding-description">${rec.description}</div>
            </div>
        `).join('');

        return `
            <div class="recommendations">
                <h3>Strategic Recommendations & Action Items</h3>
                ${recommendationsHTML}
            </div>
        `;
    }

    createCompetitorAnalysis() {
        const competitors = this.formData.topCompetitors || 'Not provided';
        const competitorStrength = this.formData.competitorStrength || 'Not assessed';
        const contentGaps = this.formData.competitorContentGap || 'Not analyzed';

        let competitiveInsight = '';
        switch(competitorStrength) {
            case 'weak':
                competitiveInsight = 'The competitive landscape presents excellent opportunities for rapid market share growth through strategic SEO implementation.';
                break;
            case 'moderate':
                competitiveInsight = 'Moderate competition exists, but strategic optimization can secure significant competitive advantages.';
                break;
            case 'strong':
                competitiveInsight = 'Strong competition requires focused, high-quality SEO strategies to achieve and maintain competitive positioning.';
                break;
            default:
                competitiveInsight = 'Competitive analysis will help identify specific opportunities for market positioning and growth.';
        }

        return `
            <div class="section">
                <h3>Competitive Landscape Analysis</h3>
                <p><strong>Primary Competitors:</strong> ${competitors}</p>
                <p><strong>Competition Level:</strong> ${competitorStrength.charAt(0).toUpperCase() + competitorStrength.slice(1)} competition</p>
                <p><strong>Content Gap Opportunities:</strong> ${contentGaps.charAt(0).toUpperCase() + contentGaps.slice(1)} opportunities for content expansion</p>
                <br>
                <p>${competitiveInsight}</p>
                ${this.formData.competitorAnalysis ? `<p><strong>Detailed Analysis:</strong> ${this.formData.competitorAnalysis}</p>` : ''}
                ${this.formData.opportunityAreas ? `<p><strong>Key Opportunity Areas:</strong> ${this.formData.opportunityAreas}</p>` : ''}
            </div>
        `;
    }

    createNextSteps() {
        return `
            <div class="section">
                <h3>Strategic Implementation Roadmap</h3>
                <ol style="padding-left: 1.5rem; line-height: 1.6;">
                    <li style="margin-bottom: 1rem;"><strong>Immediate Actions (Week 1-2):</strong> Address critical technical issues including site speed, SSL certificate, and mobile responsiveness problems</li>
                    <li style="margin-bottom: 1rem;"><strong>Short-term Optimization (Month 1):</strong> Optimize title tags, meta descriptions, and header structure across all key pages</li>
                    <li style="margin-bottom: 1rem;"><strong>Content Enhancement (Month 1-2):</strong> Develop comprehensive, keyword-rich content addressing identified gaps and user intent</li>
                    <li style="margin-bottom: 1rem;"><strong>Technical Implementation (Month 2):</strong> Implement structured data, improve site architecture, and enhance internal linking strategy</li>
                    <li style="margin-bottom: 1rem;"><strong>Performance Monitoring (Ongoing):</strong> Set up comprehensive analytics tracking and establish regular performance review cycles</li>
                    <li style="margin-bottom: 1rem;"><strong>Continuous Optimization (Ongoing):</strong> Implement regular content updates, technical maintenance, and strategy refinements based on performance data</li>
                </ol>
            </div>
        `;
    }

    createCTASection() {
        return `
            <div class="cta-section">
                <div class="cta-content">
                    <h2 class="cta-title">Ready to Transform Your SEO Performance?</h2>
                    <p class="cta-subtitle">Partner with Empire Digisol to implement these recommendations and achieve measurable results</p>
                    <a href="https://empiredigisol.com/" class="cta-button" target="_blank">Get Started Today</a>
                    
                    <div class="cta-features">
                        <div class="cta-feature">
                            <h4>✓ Expert Implementation</h4>
                            <p>Our certified SEO specialists will implement every recommendation with precision and expertise</p>
                        </div>
                        <div class="cta-feature">
                            <h4>✓ Measurable Results</h4>
                            <p>Track your progress with detailed reporting and transparent metrics that show real ROI</p>
                        </div>
                        <div class="cta-feature">
                            <h4>✓ Ongoing Support</h4>
                            <p>Continuous optimization and support to maintain and improve your search engine rankings</p>
                        </div>
                        <div class="cta-feature">
                            <h4>✓ Proven Track Record</h4>
                            <p>Join hundreds of satisfied clients who have achieved significant organic traffic growth</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <p style="margin-bottom: 1rem; font-size: 1.1rem;"><strong>🚀 Special Offer: Free 30-Minute Strategy Session</strong></p>
                        <p style="margin-bottom: 0;">Contact us today for a complimentary consultation where we'll discuss your specific needs and create a customized SEO strategy for your business.</p>
                    </div>
                </div>
            </div>
        `;
    }

    printReport() {
        // Add a small delay to ensure all styles are loaded
        setTimeout(() => {
            window.print();
        }, 100);
    }
}

// Initialize the SEO Audit Tool when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SEOAuditTool();
});