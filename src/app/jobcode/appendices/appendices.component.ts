import { Component } from '@angular/core';

interface OrgMember {
  name: string;
  title: string;
  project?: string;
  email?: string;
  mobile?: string;
  image: string;
  children?: OrgMember[];
}

@Component({
  selector: 'app-appendices',
  templateUrl: './appendices.component.html',
  styleUrls: ['./appendices.component.sass']
})
export class AppendicesComponent {

  orgChart: OrgMember = {
    name: 'Santiago Garcia',
    title: 'CEO',
    mobile: '(310) 555-0001',
    email: 'santiago@techcompany.com',
    project: 'Build growth strategy',
    image: 'assets/images/santiago.jpg',
    children: [
      {
        name: 'Noah Williams',
        title: 'Executive Assistant',
        email: 'noah@techcompany.com',
        image: 'assets/images/noah.jpg',
      },
      {
        name: 'Chuck Berry',
        title: 'Chief Financial Officer',
        email: 'chuck@techcompany.com',
        project: 'Audit finance strategy',
        image: 'assets/images/chuck.jpg',
        children: [],
      },
      {
        name: 'Arthur Brown',
        title: 'Chief Technology Officer',
        email: 'arthur@techcompany.com',
        project: 'Implement CRM',
        image: 'assets/images/arthur.jpg',
        children: [
          {
            name: 'Alice Barnes',
            title: 'Sr. Product Manager',
            email: 'alice@techcompany.com',
            project: 'Roll out CRM',
            image: 'assets/images/alice.jpg',
            children: [
              {
                name: 'Anciet Babin',
                title: 'Software Engineer',
                email: 'anciet@techcompany.com',
                project: 'Website Redesign',
                image: 'assets/images/anciet.jpg',
              },
            ],
          },
          {
            name: 'Product Director',
            title: 'Product Director',
            image: 'assets/images/hiring.png', // hiring image
          },
        ],
      },
      {
        name: 'Alexa Douglas',
        title: 'Chief Revenue Officer',
        email: 'alexa@techcompany.com',
        project: 'SalesForce Plan',
        image: 'assets/images/alexa.jpg',
        children: [
          {
            name: 'Antonia Sancho',
            title: 'Sales Manager',
            mobile: '(310) 555-2011',
            email: 'antonia@techcompany.com',
            project: 'Outline sales process',
            image: 'assets/images/antonia.jpg',
          },
          {
            name: 'Angeline Valenzuela',
            title: 'VP, Sales',
            email: 'angeline@techcompany.com',
            project: 'Website Redesign',
            image: 'assets/images/angeline.jpg',
          },
        ],
      },
      {
        name: 'Amanda Phillips',
        title: 'Chief Marketing Officer',
        email: 'amanda@techcompany.com',
        mobile: '(310) 555-1234',
        project: 'Website Redesign',
        image: 'assets/images/amanda.jpg',
        children: [
          {
            name: 'Blake Wolos',
            title: 'Creative Director',
            email: 'blake@techcompany.com',
            project: 'Website Redesign',
            image: 'assets/images/blake.jpg',
          },
          {
            name: 'Andrew Ray',
            title: 'Director of Marketing',
            email: 'andrew@techcompany.com',
            project: 'Website Redesign',
            image: 'assets/images/andrew.jpg',
          },
        ],
      },
      {
        name: 'Korah Hunter',
        title: 'Human Resources',
        mobile: '(512) 555-7574',
        email: 'korah@techcompany.com',
        project: 'Performance Plans',
        image: 'assets/images/korah.jpg',
      },
    ],
  };
}