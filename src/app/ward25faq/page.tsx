import { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from '@/components/ExternalLink';
import { ArrowUpIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQs - Ward 25 By-Election – Civic Dashboard',
};

function JumpToTopLink() {
  return (
    <div className="mt-8">
      <Link
        href="#top"
        className="inline-flex items-center gap-x-1 text-xs font-semibold hover:underline"
      >
        <ArrowUpIcon className="w-4 h-4" /> Jump to top
      </Link>
    </div>
  );
}

export default function Ward25FAQ() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-12" id="top">
            FAQs - Ward 25 By-Election
          </h1>

          <ol className="list-decimal pl-6 mb-12 space-y-1">
            <li>
              <Link href="#why" className="classic-link">
                Why is there an election?
              </Link>
            </li>
            <li>
              <Link href="#voters" className="classic-link">
                Who can vote?
              </Link>
            </li>
            <li>
              <Link href="#candidates" className="classic-link">
                Who can I vote for?
              </Link>
            </li>
            <li>
              <Link href="#when-where" className="classic-link">
                When/where can I vote?
              </Link>
            </li>
            <li>
              <Link href="#do-i-need-to-register" className="classic-link">
                Do I need to register to vote in this election?
              </Link>
            </li>
            <li>
              <Link href="#what-to-bring" className="classic-link">
                What do I bring on the day?
              </Link>
            </li>
            <li>
              <Link href="#alternative-voting-methods" className="classic-link">
                What should I do if I am unable to vote in person?
              </Link>
            </li>
            <li>
              <Link href="#how-to-stay-engaged" className="classic-link">
                How do I stay engaged after the election?
              </Link>
            </li>
          </ol>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4" id="why">
              Why is there an election?
            </h2>
            <div className="space-y-4">
              <p>
                In April 2025, the city councillor for Ward 25 Scarborough-Rouge
                Park, Jennifer McKelvie was elected as a Member of Parliament in
                Ajax, Ontario in the 2025 Canadian Federal Election. As a
                result, she resigned from her position as City Councillor and
                the Toronto City Council declared the office of Councillor for
                Ward 25 vacant, opting to hold a <strong>by-election</strong> to
                fill the position.
              </p>
              <p>
                The Ward 25 By-Election will be held on September 29th. The
                elected Councillor will hold the office for the remainder of the
                current <strong>City Council term</strong>, until the{' '}
                <strong>municipal elections</strong> on October 26th, 2026.
              </p>
            </div>

            <JumpToTopLink />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4" id="voters">
              Who can vote?
            </h2>
            <div className="space-y-4">
              <p>To vote in the Ward 25 By-Election, you must be:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>a Canadian citizen; and</li>
                <li>at least 18 years old; and</li>
                <li>a resident in Ward 25, Scarborough-Rouge Park; or</li>
                <li>
                  a non-resident of the city of Toronto, but you or your spouse
                  owns or rents property in Ward 25, Scarborough-Rouge Park; and
                </li>
                <li>not prohibited from voting under any law.</li>
              </ul>
              <p>
                Toronto residents can cast one vote per election and can only
                vote in the <strong>ward</strong> in which they live. You cannot
                vote in another ward or a ward where you own additional
                property. Therefore, the right to vote in the Ward 25
                By-Election is limited to residents of Ward 25. To find out what
                ward you live in, you can use the{' '}
                <ExternalLink
                  href="https://www.toronto.ca/city-government/data-research-maps/neighbourhoods-communities/ward-profiles/"
                  className="classic-link"
                >
                  City's interactive tool
                </ExternalLink>
                .
              </p>
              <p>
                Additionally, voting is limited to Canadian citizens. Any
                residents with any other immigration status, e.g., temporary
                workers or Permanent Residents, are prohibited from voting.
              </p>
              <p>
                You are also prohibited from voting on election day if you are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  serving a sentence of imprisonment in a penal or correctional
                  institution
                </li>
                <li>a corporation</li>
                <li>
                  acting as executor or trustee or in another representative
                  capacity, except as a voting proxy
                </li>
                <li>
                  convicted of a corrupt practice described in section 90(3) of
                  the Municipal Elections Act, 1996.
                </li>
              </ul>
              <p>
                If you are a student from another Ontario{' '}
                <strong>municipality</strong>, but are temporarily living in and
                attending an educational institution in Ward 25, you are
                eligible to vote in elections in both your "home" municipality
                and the municipality in which you currently live to attend
                school. However, if your home and school residences are both in
                Toronto, you may only vote in the ward where your "home" is
                located.
              </p>
              <p>
                If you are a resident of Ward 25, but are currently studying in
                another Ontario municipality, you are eligible to vote in the
                Ward 25 By-Election.
              </p>
              <p>
                For additional information on vote eligibility, call 311 or
                check the City's{' '}
                <ExternalLink
                  href="https://www.toronto.ca/city-government/elections/2025-by-election-councillor-ward-25-scarborough-rouge-park/by-election-voters/ward-25-scarborough-rouge-park-by-election-information-for-voters/?accordion=who-can-vote"
                  className="classic-link"
                >
                  website
                </ExternalLink>
                .
              </p>
            </div>

            <JumpToTopLink />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4" id="candidates">
              Who can I vote for?
            </h2>
            <p>
              A complete list of certified candidates, along with details of
              their nomination date, contact information and social media pages,
              is available on the{' '}
              <ExternalLink
                href="https://www.toronto.ca/city-government/elections/ward-25-scarborough-rouge-park-by-election-list-of-candidates-third-party-advertisers/"
                className="classic-link"
              >
                City of Toronto website
              </ExternalLink>
              .
            </p>

            <JumpToTopLink />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4" id="when-where">
              When/where can I vote?
            </h2>
            <div className="space-y-4">
              <p>
                There are three days allocated for in-person voting in the Ward
                25 By-Election.
              </p>
              <p>
                There are two days of advance voting, on{' '}
                <strong>
                  Saturday, September 20th and Sunday, September 21st, 2025.
                </strong>{' '}
                Advance voting is open to anyone who is otherwise eligible to
                vote in the Ward 25 By-Election. Two locations in Ward 25 will
                be open to voters between{' '}
                <strong>10:00 a.m. and 7:00 p.m.</strong> on both of these
                dates:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Heron Park Community Centre, Community Room A & B -{' '}
                  <ExternalLink
                    href="https://maps.app.goo.gl/b1VFqWjoS4KJKjTz5"
                    className="classic-link"
                  >
                    292 Manse Road
                  </ExternalLink>
                </li>
                <li>
                  Malvern Community Recreation Centre, Community Room -{' '}
                  <ExternalLink
                    href="https://maps.app.goo.gl/Y4PeFR4E7WaDNEW68"
                    className="classic-link"
                  >
                    30 Sewells Road
                  </ExternalLink>
                </li>
              </ol>
              <p>
                Both locations will have an accessible entrance, as well as a
                Voter Assist Terminal, enabling voters with disabilities to mark
                their ballot privately and independently.
              </p>
              <p>
                A third and final day of voting will occur on Election Day,{' '}
                <strong>
                  September 29th, 2025, between 10:00 a.m. and 8:00 p.m.
                </strong>{' '}
                There will be several voting places across Ward 25, with each
                voter being allocated a designated voting place, based on their
                address. You can find your designated voting place using the{' '}
                <ExternalLink
                  href="https://myvote.toronto.ca/votingplace"
                  className="classic-link"
                >
                  My Voting Place
                </ExternalLink>{' '}
                section of the{' '}
                <ExternalLink
                  href="https://myvote.toronto.ca/home"
                  className="classic-link"
                >
                  MyVote website
                </ExternalLink>
                .
              </p>
              <p>
                We have included a list of the voting places that will be
                available for the Ward 25 By-Election on September 29th below.
                Please note that these voting places are subject to change, and
                you should consult MyVote and the City's{' '}
                <ExternalLink
                  href="https://www.toronto.ca/city-government/elections/2025-by-election-councillor-ward-25-scarborough-rouge-park/by-election-voters/voting-places-ward-map/"
                  className="classic-link"
                >
                  dedicated webpage
                </ExternalLink>{' '}
                before attending any of these locations on Election Day.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        #
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Building Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Thomas L Wells Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        69 Nightstar Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">2</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Mayfair on the Green
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        440 McLevin Ave
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">3</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Neilson Hall Apartments
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        1315 Neilson Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">4</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Glenmaple
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        1319 Neilson Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">5</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Malvern Recreation Centre
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        30 Sewells Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">6</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Sacred Heart Catholic School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        75 Hupfield Trail
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">7</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Heritage Park Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        80 Old Finch Ave
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">8</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Malvern Family Resource Centre
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        90 Littles Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">9</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Alexander Stirling Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        70 Fawcett Trail
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">10</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Grey Owl Junior Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        150 Wickson Trail
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">11</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Emily Carr Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        90 John Tabor Trail
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">12</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Malvern Christian Assembly
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        6705 Sheppard Ave E
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">13</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Alvin Curling Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        50 Upper Rouge Trail
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">14</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Extendicare Rouge Valley
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        551 Conlins Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">15</td>
                      <td className="border border-gray-300 px-4 py-2">
                        John G. Diefenbaker Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        70 Dean Park Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">16</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Chief Dan George Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        185 Generation Blvd
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">17</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Rouge Valley Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        30 Durnford Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">18</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Glen Rouge Community Long Term Care
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        92 Island Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">19</td>
                      <td className="border border-gray-300 px-4 py-2">
                        West Rouge Jr. Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        401 Friendship Avenue
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">20</td>
                      <td className="border border-gray-300 px-4 py-2">
                        West Rouge Community Centre
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        270 Rouge Hills Drive
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">21</td>
                      <td className="border border-gray-300 px-4 py-2">
                        William G. Davis Jr. Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        128 East Avenue
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">22</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Port Union Community Centre
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        5450 Lawrence Ave East
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">23</td>
                      <td className="border border-gray-300 px-4 py-2">
                        St. Brendan Catholic School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        186 Centennial Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">24</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Centennial Road Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        271 Centennial Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">25</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Tony Stacey Centre for Veterans Care
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        59 Lawson Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">26</td>
                      <td className="border border-gray-300 px-4 py-2">
                        St. Dunstan of Canterbury Church
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        56 Lawson Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">27</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Meadowvale Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        761 Meadowvale Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">28</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Cardinal Leger Catholic School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        600 Morrish Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">29</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Morrish Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        61 Canmore Blvd.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">30</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Highland Creek Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        1410 Military Trail
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">31</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Eesti Kodu
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        50 Old Kingston Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">32</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Ehatare Retirement Home
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        40 Old Kingston Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">33</td>
                      <td className="border border-gray-300 px-4 py-2">
                        West Hill Public School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        299 Morningside Ave.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">34</td>
                      <td className="border border-gray-300 px-4 py-2">
                        St. Malachy Catholic School
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        80 Bennett Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">35</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Heron Park Community Centre
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        292 Manse Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">36</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Morningside Apartments
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        4205 Lawrence Avenue East
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">37</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Academie Alexandre-Dumas
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        255 Coronation Drive
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">38</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Malvern Recreation Centre
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        30 Sewells Road
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">39</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Heron Park Community Centre
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        292 Manse Road
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <JumpToTopLink />
          </section>

          <section className="mb-12">
            <h2
              className="text-2xl font-semibold mb-4"
              id="do-i-need-to-register"
            >
              Do I need to register to vote in this election?
            </h2>
            <div className="space-y-4">
              <p>
                You will need to be on the <strong>Voters' List</strong> to vote
                in the by-election, but you do not need to register in advance.
                However, there are several reasons why registration on the
                Voters' List can be beneficial.
              </p>

              <h3 className="text-xl font-medium mb-3">
                Registering in Advance for the Voters' List
              </h3>
              <p>
                You can add, amend or update your information on the Voters'
                List through the City's{' '}
                <ExternalLink
                  href="https://myvote.toronto.ca/home"
                  className="classic-link"
                >
                  MyVote
                </ExternalLink>{' '}
                tool. This is particularly important if your name or address has
                recently changed. Ensuring your information is correct on the
                Voters' List before you vote will allow for a smoother check-in
                at the voting place and will reduce the risk of unnecessary
                delays or errors.
              </p>
              <p>
                Additionally, registering on the Voters' List will give you
                access to a <strong>voter information card</strong>, which will
                provide information on where to vote and will lead to a faster
                voting experience. If you register{' '}
                <strong>before September 4th, 2025</strong>, your voter
                information card will be mailed to you. If you register your
                details after this date, you will be able to access a digital
                voter information card through the MyVote website. It is
                important to note that the voter information card is{' '}
                <strong>not a valid form of identification</strong> for the
                by-election.
              </p>

              <h3 className="text-xl font-medium mb-3">
                Registering for the Voters' List When You Arrive to Vote
              </h3>
              <p>
                Alternatively, you can add your information to the Voters' List
                when you arrive at your allocated voting place. The election
                staff will then confirm your eligibility to vote and issue your
                ballot.
              </p>
              <p>
                For more information on the Voters' List, or to add or update
                your information, please visit the City's{' '}
                <ExternalLink
                  href="https://myvote.toronto.ca/home"
                  className="classic-link"
                >
                  MyVote
                </ExternalLink>{' '}
                website.
              </p>
            </div>

            <JumpToTopLink />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4" id="what-to-bring">
              What do I bring on the day?
            </h2>
            <div className="space-y-4">
              <p>
                To vote in the Ward 25 By-Election, you will need to bring{' '}
                <strong>one</strong> piece of ID with you that verifies your
                name and your Ward 25 address. While electronic versions of
                documents that were originally issued electronically are
                acceptable, e.g. e-statements, all other forms must be presented
                in their original hard copy.
              </p>
              <p>
                Voter Information Cards and Passports are not acceptable forms
                of ID for the by-election. The City recommends that you bring
                identification such as a driver's licence, bank statement,
                utility bill or lease agreement. A complete list of acceptable
                forms of ID is available online{' '}
                <ExternalLink
                  href="https://www.toronto.ca/wp-content/uploads/2023/05/98ac-Acceptable-Identification-2023.pdf"
                  className="classic-link"
                >
                  at this link
                </ExternalLink>
                .
              </p>
            </div>

            <JumpToTopLink />
          </section>

          <section className="mb-12">
            <h2
              className="text-2xl font-semibold mb-4"
              id="alternative-voting-methods"
            >
              What should I do if I am unable to vote in person?
            </h2>
            <div className="space-y-4">
              <p>
                If you are unable to vote in person, but meet the eligibility
                criteria to vote in the Ward 25 By-Election, the City will allow
                you to <strong>mail in your vote</strong> or{' '}
                <strong>vote by proxy</strong>.
              </p>

              <h3 className="text-xl font-medium mb-3">Mail-in Voting:</h3>
              <p>
                To mail in your vote, you must{' '}
                <ExternalLink
                  href="https://myvote.toronto.ca/mailinvoting/lookup"
                  className="classic-link"
                >
                  register with the City
                </ExternalLink>{' '}
                <strong>
                  between August 18th and September 4th, 2025, at 4:30 p.m. ET
                </strong>
                . Once your application is processed, you will receive a mail-in
                package for the election, containing a declaration (which must
                be signed for your vote to count!), an official ballot, a white
                secrecy envelope, and a yellow return envelope with prepaid
                postage.
              </p>
              <p>
                If you are not already on the Voters' List, you will also have
                to include a photocopy of your identification with your ballot.
              </p>
              <p>
                To complete your vote, simply put your marked ballot, signed
                declaration, and identification (if necessary) into the white
                secrecy envelope, put this all into the yellow return envelope,
                and post your ballot to the return address. Toronto Elections
                must receive your ballot and declaration by Tuesday, September
                23, 2025, at noon.
              </p>
              <p>
                You can also choose to hand-deliver your envelope to the
                election drop-boxes, located at Heron Park Community Recreation
                Centre, 292 Manse Rd and Malvern Recreation Centre, 30 Sewells
                Rd. Your hand-delivery must be received between September 15 and
                before noon on September 23 for your vote to count.
              </p>
              <p>
                For more information on the mail-in voting requirements for the
                Ward 25 By-Election, please see the{' '}
                <ExternalLink
                  href="https://www.toronto.ca/city-government/elections/2025-by-election-councillor-ward-25-scarborough-rouge-park/by-election-voters/ward-25-scarborough-rouge-park-by-election-mail-in-voting/"
                  className="classic-link"
                >
                  City's website
                </ExternalLink>
                .
              </p>

              <h3 className="text-xl font-medium mb-3">Proxy Voting:</h3>
              <p>
                Eligible voters can also elect to have someone vote on their
                behalf, known as proxy voting. You can appoint anyone that is
                eligible to vote in a Toronto municipal election to act as your
                proxy, and it should be someone you trust to vote on your
                behalf. You can appoint a proxy using a Voting Proxy Appointment
                Form, which can be obtained by emailing{' '}
                <ExternalLink
                  href="mailto:voterregistration@toronto.ca"
                  className="classic-link"
                >
                  voterregistration@toronto.ca
                </ExternalLink>{' '}
                or by visiting the Toronto Elections office at{' '}
                <ExternalLink
                  href="https://maps.app.goo.gl/vnMV7irgP96n9yKT7"
                  className="classic-link"
                >
                  <strong>City Hall, 100 Queen St</strong>
                </ExternalLink>
                . The form must be completed and signed by both the voter and
                the proxy, and certified by the City Clerk in person by 4:30
                p.m. on September 29th, 2025.
              </p>
              <p>
                The form can be certified at the Toronto Elections office at
                City Hall, or by appointment only at Toronto Elections office at{' '}
                <ExternalLink
                  href="https://maps.app.goo.gl/K9eJsJ6f4FGfJGu2A"
                  className="classic-link"
                >
                  <strong>89 Northline Rd</strong>
                </ExternalLink>
                . To schedule an appointment, email{' '}
                <ExternalLink
                  href="mailto:voterregistration@toronto.ca"
                  className="classic-link"
                >
                  voterregistration@toronto.ca
                </ExternalLink>{' '}
                or call 311. Additionally, the Voting Proxy Appointment Form can
                be certified at either of the advance voting places (Malvern
                Recreation Centre and Heron Park Community Recreation Centre) on
                September 20th and 21st, 2025.
              </p>
              <p>
                For additional information on proxy voting, please visit the{' '}
                <ExternalLink
                  href="https://www.toronto.ca/news/mail-in-voting-applications-for-ward-25-scarborough-rouge-park-by-election-due-september-4/"
                  className="classic-link"
                >
                  City's Website
                </ExternalLink>
                .
              </p>
            </div>

            <JumpToTopLink />
          </section>

          <section className="mb-12">
            <h2
              className="text-2xl font-semibold mb-4"
              id="how-to-stay-engaged"
            >
              How do I stay engaged after the election?
            </h2>
            <div className="space-y-4">
              <p>
                There are lots of ways to stay engaged with City Council in your
                local community and across the City. Getting engaged with City
                Council outside of election time is easier than you might think,
                and can go a long way to influencing the decisions that matter
                to you and your community. At Civic Dashboard, we aim to make
                understanding and engaging with City Council more accessible for
                all Toronto residents.
              </p>
              <p>
                Here are some examples of steps you can take to engage with City
                Council once the by-election is over:
              </p>

              <h3 className="text-xl font-medium mb-3">
                1. Follow up with your new Councillor
              </h3>
              <p>
                Using our{' '}
                <Link href="/councillors" className="classic-link">
                  Councillor's page
                </Link>
                , you can view voting records, contact details and agenda items
                of the new Ward 25 Councillor, as well as all other Councillors
                across Toronto. You can contact your local councillor by phone
                or email to discuss issues that matter to you. Councillors can
                advocate on your behalf and provide insights into ongoing city
                decisions.
              </p>

              <h3 className="text-xl font-medium mb-3">
                2. Attend a Consultation
              </h3>
              <p>
                City staff often hold consultations, surveys, or community
                meetings to gather feedback on new policies and projects. These
                are open to all and are great opportunities to share your
                thoughts early in the decision-making process. The City lists
                upcoming consultations on their{' '}
                <ExternalLink
                  href="https://www.toronto.ca/community-people/get-involved/public-consultations/"
                  className="classic-link"
                >
                  consultations page
                </ExternalLink>{' '}
                - see if you can find one you are interested in attending!
              </p>

              <h3 className="text-xl font-medium mb-3">
                3. Submit a Comment or make a Deputation
              </h3>
              <p>
                At the committee stage, members of the public can choose to
                share their thoughts directly on an agenda item. You can choose
                to submit a written comment expressing your thoughts to the
                committee, or you can make a deputation, which is a formal
                presentation where you share your view directly with council
                members during a public meeting. Your public comments can
                influence the proposal under review before it reaches City
                Council, or be taken into consideration for future proposals. To
                see upcoming agenda items that you might want to share your
                thoughts on, visit our{' '}
                <Link href="/actions" className="classic-link">
                  actions page
                </Link>{' '}
                and hit the "take action" button!
              </p>
            </div>

            <JumpToTopLink />
          </section>
        </div>
      </main>
    </div>
  );
}
