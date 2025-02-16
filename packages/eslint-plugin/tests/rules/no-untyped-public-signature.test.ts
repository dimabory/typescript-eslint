import rule from '../../src/rules/no-untyped-public-signature';
import { RuleTester } from '../RuleTester';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {},
  },
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no-untyped-public-signature', rule, {
  valid: [
    {
      code: `class A {
                  private a(c) {
                  }
                }`,
    },
    {
      code: `class A {
                  private async a(c) {
                  }
                }`,
    },
    {
      code: `
            class A {
                public b(c: string):void {
                
                }
            }`,
    },
    {
      code: `
             class A {
                public b(...c):void {
                
                }
            }`,
    },
    {
      code: `
             class A {
                b(c):void {
                
                }
            }`,
      options: [{ ignoredMethods: ['b'] }],
    },
    {
      code: `
             class A {
                ['b'](c):void {

                }
            }`,
      options: [{ ignoredMethods: ['b'] }],
    },
    {
      code: `
             class A {
                [\`b\`](c):void {

                }
            }`,
      options: [{ ignoredMethods: ['b'] }],
    },
    {
      code: `
             class A {
                b(...c):void {
                
                }
                
                d(c):void {
                
                }
            }`,
      options: [{ ignoredMethods: ['b', 'd'] }],
    },
  ],
  invalid: [
    //untyped parameter
    {
      code: `class A {
                public b(c):void {
                
                }
            }`,
      errors: [{ messageId: 'untypedParameter' }],
    },
    //untyped parameter (any)
    {
      code: `class A {
                public b(c: any):void {

                }
            }`,
      errors: [{ messageId: 'untypedParameter' }],
    },
    //implicit public method
    {
      code: `class A {
                b(c):void {

                }
            }`,
      errors: [{ messageId: 'untypedParameter' }],
    },
    //implicit async public method
    {
      code: `class A {
                  async a(c): void {
                  }
                }`,
      errors: [{ messageId: 'untypedParameter' }],
    },
    //no return type
    {
      code: `class A {
                  public a(c: number) {
                  }
                }`,
      errors: [{ messageId: 'noReturnType' }],
    },
    //no return type + untyped parameter
    {
      code: `class A {
                public b(c) {

                }
            }`,
      errors: [
        { messageId: 'untypedParameter' },
        { messageId: 'noReturnType' },
      ],
    },
    //any return type
    {
      code: `class A {
                public b(c: number): any {

                }
            }`,
      errors: [{ messageId: 'noReturnType' }],
    },
    //with ignored methods
    {
      code: `class A {
                public b(c: number): any {

                }

                c() {
                }
            }`,
      options: [{ ignoredMethods: ['c'] }],
      errors: [{ messageId: 'noReturnType' }],
    },
    {
      code: `
          let c = 'd';
          class A {
                [methodName]() {
                }
            }`,
      options: [{ ignoredMethods: ['methodName'] }],
      errors: [{ messageId: 'noReturnType' }],
    },
    {
      code: `
          class A {
                [1]() {
                }
            }`,
      options: [{ ignoredMethods: ['1'] }],
      errors: [{ messageId: 'noReturnType' }],
    },
    {
      code: `
          let c = 'C';
          class A {
                [\`methodName\${c}\`]() {
                }
            }`,
      options: [{ ignoredMethods: ['methodNameC', 'methodNamec'] }],
      errors: [{ messageId: 'noReturnType' }],
    },
    {
      code: `
          let c = '1';
          class A {
                [(c as number)]() {
                }
            }`,
      options: [{ ignoredMethods: ['1'] }],
      errors: [{ messageId: 'noReturnType' }],
    },
    {
      code: `
          class A {
                abstract c() {
                }
            }`,
      errors: [{ messageId: 'noReturnType' }],
    },
  ],
});
