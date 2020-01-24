
# Manually testing Program Manager and Registrar

This is a runbook to guide one through a series of manual tests
of Program Manager a connected
[Registrar](https://github.com/edx/registrar) instance.
It assumes that Registrar is running and pointed at an associated
[LMS](https://github.com/edx/edx-platform) instance,
[Discovery](https://github.com/course-discovery) instance,
memcached cluster,
and MySQL service.

This should be the case if you are running a well-provisioned
[edX Devstack](https://github.com/edx/devstack)
or if you are an edX employee testing on the Staging environment
or a well-provisioned Sandbox environment.

## Setup

### Users

Make sure these two users exist beforehand:
* An administrator, with Superuser privileges.
  We'll call this user **admin**, but they can be named anything.
  If you work for edX, this will be your `@edx.org` staff account.
* Another user *without* Superuser privileges,
  who must exist in LMS but have **not** yet SSO'ed in Registrar.
  We'll call this user **integrator**, but they can be named anything.
  They will represent an employee of an edX partner who is
  manager programs using Program Manager and/or the Registrar API.
  * If you wish to use a Registrar user who _has_ SSO'ed into
    Registrar before, you can reset their Registrar SSO state by
    deleting the associated `User` entry and all associated
    `UserSocialAuth` entries in the Registrar DB.

### Discovery Data

As **admin**, go to the Discovery administration panel.
Make sure that both the "Masters" and "MicroMasters"
program types exist, creating them if they don't.
Don't worry about "Eligible Seat Types";
just selecting at least "Verified" should work.

Once that is done, create an `Organization`:
* **Partner:** "edX", or if that's not there, whatever is first in the drop-down.
* **Key:** "test-org", or something like that.
* **Name:** "Test Organization", or something like that.
* Save.

Then, create a `Program`:
* **Title:** "Test MicroMaster's Program", or something like that.
* **Status:** "Active"
* **Type:** "MicroMasters"
* **Partner:** The same partner you used for the test organization.
* **Marketing Slug:** "test-micromasters", or something like that.
* **Banner Image:** Any .jpg file; this is just to make the validator happy.
* **Courses:** Add the following courses:
  * course+v1:todo+todo
  * course+v1:todo+todo
* Save. If you are prompted to enter excluded course runs,
just hit "Save Course Run".

Next, create a second `Program`:
* **Title:** "Test Master's Program", or something like that.
* **Status:** "Active"
* **Type:** "Masters"
* **Partner:** The same partner you used for the test organization.
* **Marketing Slug:** "test-masters", or something like that.
* **Banner Image:** Any .jpg file; this is just to make the validator happy.
* **Courses:** Leave blank.
  Instead, we will add courses in the next step using a `Curriculum`.
* Save. Again, if you are prompted to enter excluded course runs,
just hit "Save Course Run".

Create a `Curriculum` for the Master's program:
* **Program:** The Master's program you just created.
* **Is active:** ✓
* **Marketing Text:** Any non-empty string.
* Save.

Then, create a `CurriculumCourseMembership`s for each
of the following courses, linking them to the Master's
curriculum:
  * course+v1:todo+todo
  * course+v1:todo+todo

Finally, create a `CurriculumCourseRunExclusion`
to exlude the single run "course-v1:todo-todo-todo"
from the Master's curriculum.

### Registrar Data

As **admin**, open the Registrar administration panel.

Create an `Organization` to match the one in Discovery:
* **Key**: The same organization key you entered in Discovery.
* **Discovery uuid:** Copy the "UUID" from the Discovery test organization.
* **Name**: The same organization name you entered in Discovery.

Create two `Program`s to match the MicroMaster's and Master's programs in Discovery:
* **Managing organization**: the organization you just created.
* **Key**: The Marketing Slug of the corresponding Discovery program.
* **Discovery uuid** The UUID of the corresponding Discovery program.

Create an `OrganizationGroup`:
* **Name**: "TestOrganizationManagers", or something like that.
* **Organization**: the test organization you created.
* **Role**: "Read Organization Reports".

Finally, create a `PendingUserGroup`:
* **Email:** The email address of **integrator**.
* **Group:** The test organization group you just created.


## Test 1: SSO & pending user groups

This test ensures that single sign-on is working,
and that users with pending-user-group records
are transferred to the associated auth group upon
account linkage.

1. Log out of LMS.
1. Access Program Manager.
1. You should be redirected to LMS.
1. Log in as **integrator**.
1. You should be directed back to Program Manager.

In separate session, access the Registrar admin panel as **admin**.
1. **integrator** should exist as a `User`.
1. **integrator** should be a member of the TestOrganizationManagers group.
1. The `PendingUserGroup` entry you created should be gone.

## Test 2: ...

1. As **integrator**, access Program Manager.
1. ...