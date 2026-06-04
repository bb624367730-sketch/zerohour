import { useState } from 'react';
import { useT } from '../i18n/context';
import { TEAM_LIST, getTeamTransKey } from '../constants';

export function HowToPlay() {
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useT();

  return (
    <div className="howtoplay">
      {/* Simple 3-step guide */}
      <div className="htp-steps">
        <div className="htp-step">
          <div className="htp-step-num">1</div>
          <div className="htp-step-emoji">&#x1f3af;</div>
          <div className="htp-step-title">{t('htp.step1.title')}</div>
          <div className="htp-step-desc">{t('htp.step1.desc')}</div>
          <div className="htp-step-teams">
            <span className="htp-tag tag-doge">&#x1f415; {t('htp.step1.tag1')}</span>
            <span className="htp-tag tag-pepe">&#x1f438; {t('htp.step1.tag2')}</span>
            <span className="htp-tag tag-monkey">&#x1f412; {t('htp.step1.tag3')}</span>
            <span className="htp-tag tag-cat">&#x1f431; {t('htp.step1.tag4')}</span>
          </div>
        </div>

        <div className="htp-step">
          <div className="htp-step-num">2</div>
          <div className="htp-step-emoji">&#x1f3ab;</div>
          <div className="htp-step-title">{t('htp.step2.title')}</div>
          <div className="htp-step-desc">{t('htp.step2.desc')}</div>
          <div className="htp-step-note">{t('htp.step2.note')}</div>
        </div>

        <div className="htp-step">
          <div className="htp-step-num">3</div>
          <div className="htp-step-emoji">&#x1f4b0;</div>
          <div className="htp-step-title">{t('htp.step3.title')}</div>
          <div className="htp-step-desc">{t('htp.step3.desc')}</div>
          <div className="htp-step-note">{t('htp.step3.note')}</div>
        </div>
      </div>

      {/* Toggle detailed rules */}
      <button
        className="htp-toggle"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? t('htp.hideDetails') : t('htp.showDetails')}
        <span className={`htp-arrow ${showDetails ? 'open' : ''}`}>&#9660;</span>
      </button>

      {/* Detailed rules */}
      {showDetails && (
        <div className="htp-details">
          <RuleSection title={t('htp.rule.mechanics')}>
            <li>{t('htp.rule.mechanics.1')}</li>
            <li>{t('htp.rule.mechanics.2')}</li>
            <li>{t('htp.rule.mechanics.3')}</li>
            <li>{t('htp.rule.mechanics.4')}</li>
          </RuleSection>

          <RuleSection title={t('htp.rule.pricing')}>
            <li>{t('htp.rule.pricing.1')}</li>
            <li>{t('htp.rule.pricing.2')}</li>
            <li>{t('htp.rule.pricing.3')}</li>
          </RuleSection>

          <RuleSection title={t('htp.rule.teams')}>
            <table className="htp-table">
              <thead>
                <tr>
                  <th>{t('htp.rule.teams.th1')}</th>
                  <th>{t('htp.rule.teams.th2')}</th>
                  <th>{t('htp.rule.teams.th3')}</th>
                  <th>{t('htp.rule.teams.th4')}</th>
                  <th>{t('htp.rule.teams.th5')}</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_LIST.map((team) => {
                  const transKey = getTeamTransKey(team.id);
                  return (
                    <tr key={team.id}>
                      <td>{team.emoji} {t(`team.${transKey}.name`)}</td>
                      <td><strong>{team.playerDivPct}%</strong></td>
                      <td>{team.jackpotPct}%</td>
                      <td>{team.zhPct}%</td>
                      <td>{t(`htp.rule.teams.row${team.id + 1}col5`)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </RuleSection>

          <RuleSection title={t('htp.rule.zh.title')}>
            <li>{t('htp.rule.zh.1')}</li>
            <li>{t('htp.rule.zh.2')}</li>
            <li>{t('htp.rule.zh.3')}</li>
            <li>{t('htp.rule.zh.4')}</li>
            <li>{t('htp.rule.zh.5')}</li>
          </RuleSection>

          <RuleSection title={t('htp.rule.funds')}>
            <table className="htp-table">
              <thead>
                <tr><th>{t('htp.rule.funds.th1')}</th><th>{t('htp.rule.funds.th2')}</th><th>{t('htp.rule.funds.th3')}</th></tr>
              </thead>
              <tbody>
                <tr><td>{t('htp.rule.funds.row1col1')}</td><td>{t('htp.rule.funds.teamDecides')}</td><td>{t('htp.rule.funds.row1col3')}</td></tr>
                <tr><td>{t('htp.rule.funds.row2col1')}</td><td>{t('htp.rule.funds.teamDecides')}</td><td>{t('htp.rule.funds.row2col3')}</td></tr>
                <tr><td>{t('htp.rule.funds.row3col1')}</td><td>{t('htp.rule.funds.teamDecides')}</td><td>{t('htp.rule.funds.row3col3')}</td></tr>
                <tr><td>{t('htp.rule.funds.row4col1')}</td><td>10%</td><td>{t('htp.rule.funds.row4col3')}</td></tr>
                <tr><td>{t('htp.rule.funds.row5col1')}</td><td>2%</td><td>{t('htp.rule.funds.row5col3')}</td></tr>
                <tr><td>{t('htp.rule.funds.row6col1')}</td><td>1%</td><td>{t('htp.rule.funds.row6col3')}</td></tr>
              </tbody>
            </table>
          </RuleSection>

          <RuleSection title={t('htp.rule.dividends')}>
            <li>{t('htp.rule.dividends.1')}</li>
            <li>{t('htp.rule.dividends.2')}</li>
            <li>{t('htp.rule.dividends.3')}</li>
            <li>{t('htp.rule.dividends.4')}</li>
            <li>{t('htp.rule.dividends.5')}</li>
          </RuleSection>

          <RuleSection title={t('htp.rule.jackpot')}>
            <table className="htp-table">
              <thead>
                <tr><th>{t('htp.rule.jackpot.th1')}</th><th>{t('htp.rule.jackpot.th2')}</th><th>{t('htp.rule.jackpot.th3')}</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>{t('htp.rule.jackpot.row1col1')}</strong></td><td><strong>48%</strong></td><td>{t('htp.rule.jackpot.row1col3')}</td></tr>
                <tr><td>{t('htp.rule.jackpot.row2col1')}</td><td>25-40%</td><td>{t('htp.rule.jackpot.row2col3')}</td></tr>
                <tr><td>{t('htp.rule.jackpot.row3col1')}</td><td>10-25%</td><td>{t('htp.rule.jackpot.row3col3')}</td></tr>
                <tr><td>{t('htp.rule.jackpot.row4col1')}</td><td>2%</td><td>{t('htp.rule.jackpot.row4col3')}</td></tr>
              </tbody>
            </table>
          </RuleSection>

          <RuleSection title={t('htp.rule.airdrop')}>
            <li>{t('htp.rule.airdrop.1')}</li>
            <li>{t('htp.rule.airdrop.2')}</li>
            <li>{t('htp.rule.airdrop.3')}</li>
          </RuleSection>

          <RuleSection title={t('htp.rule.referral')}>
            <li>{t('htp.rule.referral.1')}</li>
            <li>{t('htp.rule.referral.2')}</li>
            <li>{t('htp.rule.referral.3')}</li>
          </RuleSection>

          <RuleSection title={t('htp.rule.security')}>
            <li>{t('htp.rule.security.1')}</li>
            <li>{t('htp.rule.security.2')}</li>
            <li>{t('htp.rule.security.3')}</li>
            <li>{t('htp.rule.security.4')}</li>
          </RuleSection>

          <RuleSection title={t('htp.rule.flow')}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: 12, textAlign: 'center' }}>
              {t('htp.rule.flow.desc')}
            </p>
            <div className="htp-flow">
              <span className="htp-flow-source">SUI Purchase</span>
              <span className="htp-flow-arrow">&#10132;</span>
              <div className="htp-flow-splits">
                <div className="htp-flow-item">
                  <div className="pct">{t('htp.rule.flow.divLabel')}</div>
                  <div className="label">{t('htp.rule.flow.divDesc')}</div>
                </div>
                <div className="htp-flow-item">
                  <div className="pct">{t('htp.rule.flow.jpLabel')}</div>
                  <div className="label">{t('htp.rule.flow.jpDesc')}</div>
                </div>
                <div className="htp-flow-item">
                  <div className="pct">{t('htp.rule.flow.zhLabel')}</div>
                  <div className="label">{t('htp.rule.flow.zhDesc')}</div>
                </div>
                <div className="htp-flow-item">
                  <div className="pct">10%</div>
                  <div className="label">{t('htp.rule.flow.refDesc')}</div>
                </div>
                <div className="htp-flow-item">
                  <div className="pct">2%</div>
                  <div className="label">{t('htp.rule.flow.comDesc')}</div>
                </div>
                <div className="htp-flow-item">
                  <div className="pct">1%</div>
                  <div className="label">{t('htp.rule.flow.adDesc')}</div>
                </div>
              </div>
            </div>
          </RuleSection>

          <RuleSection title={t('htp.rule.strategy')}>
            <li>{t('htp.rule.strategy.1')}</li>
            <li>{t('htp.rule.strategy.2')}</li>
            <li>{t('htp.rule.strategy.3')}</li>
            <li>{t('htp.rule.strategy.4')}</li>
          </RuleSection>

          <RuleSection title={t('htp.rule.faq')}>
            <div className="htp-faq-item">
              <div className="htp-faq-q">{t('htp.rule.faq.q1')}</div>
              <div className="htp-faq-a">{t('htp.rule.faq.a1')}</div>
            </div>
            <div className="htp-faq-item">
              <div className="htp-faq-q">{t('htp.rule.faq.q2')}</div>
              <div className="htp-faq-a">{t('htp.rule.faq.a2')}</div>
            </div>
            <div className="htp-faq-item">
              <div className="htp-faq-q">{t('htp.rule.faq.q3')}</div>
              <div className="htp-faq-a">{t('htp.rule.faq.a3')}</div>
            </div>
            <div className="htp-faq-item">
              <div className="htp-faq-q">{t('htp.rule.faq.q4')}</div>
              <div className="htp-faq-a">{t('htp.rule.faq.a4')}</div>
            </div>
          </RuleSection>
        </div>
      )}
    </div>
  );
}

function RuleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="htp-rule">
      <h4>{title}</h4>
      <ul>{children}</ul>
    </div>
  );
}
